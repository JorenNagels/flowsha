import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

// --- Config (swap when the real domain is bought) ---
const SITE_DOMAIN = 'flowsha.co.uk';
const TO_EMAIL = process.env.TO_EMAIL || 'hello@flowsha.co.uk';
const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@flowsha.co.uk';
const SES_REGION = process.env.AWS_SES_REGION || 'eu-west-2';
// SSM SecureString holding the Cloudflare Turnstile secret key. Created once,
// out of band (see DEPLOYMENT.md) — never committed. The Lambda reads it at runtime.
const TURNSTILE_SECRET_PARAM = '/flowsha/turnstile-secret';
// SSM SecureStrings holding the Stripe keys. Created once, out of band (see
// DEPLOYMENT.md) — never committed. Same pattern as TURNSTILE_SECRET_PARAM.
const STRIPE_SECRET_PARAM = '/flowsha/stripe-secret-key';
const STRIPE_WEBHOOK_SECRET_PARAM = '/flowsha/stripe-webhook-secret';
// Clerk instance issuer for verifying dashboard session JWTs (public config, no
// secret). Set at deploy: `CLERK_ISSUER=https://<slug>.clerk.accounts.dev`.
// Empty = dashboard auth disabled (GET /feedback always 401).
const CLERK_ISSUER = process.env.CLERK_ISSUER || '';
// Optional comma-separated email allowlist (defence-in-depth on top of Clerk's
// invite-only instance). Only enforced if the session token carries an email claim.
const DASHBOARD_ALLOWED_EMAILS = process.env.DASHBOARD_ALLOWED_EMAILS || '';
// CloudFront certs must live in us-east-1. DNS-validated cert for the apex + www,
// issued 2026-06-07 in the Flowsha account.
const CLOUDFRONT_CERT_ARN =
  'arn:aws:acm:us-east-1:616853831644:certificate/17f21f31-1d36-465e-85fe-a5a13064bdab';

export class FlowshaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CLERK_ISSUER comes from the deployer's shell, so a plain `cdk deploy`
    // without it exported silently ships '' and disables dashboard auth —
    // every authenticated route then 401s. Fail the synth instead of finding
    // out in production. Override with `-c allowNoClerkIssuer=true`.
    if (!CLERK_ISSUER && !this.node.tryGetContext('allowNoClerkIssuer')) {
      cdk.Annotations.of(this).addError(
        'CLERK_ISSUER is not set — deploying now would disable dashboard auth. ' +
          'Export CLERK_ISSUER=https://clerk.flowsha.co.uk (see DEPLOYMENT.md), ' +
          'or pass -c allowNoClerkIssuer=true to deploy without it deliberately.',
      );
    }

    // --- DynamoDB table for hidden client-feedback survey submissions. ---
    //     On-demand billing (rounds to $0 at this volume; 25 GB storage is
    //     always-free) and RETAIN so submissions survive a stack delete.
    const feedbackTable = new dynamodb.Table(this, 'FeedbackTable', {
      tableName: 'flowsha-feedback',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // --- DynamoDB table for signed PAR-Q + Informed Consent waivers. ---
    //     Same on-demand billing + RETAIN policy as the feedback table.
    const waiverTable = new dynamodb.Table(this, 'WaiverTable', {
      tableName: 'flowsha-waiver',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // --- DynamoDB table for ready-made hoops (the dashboard-managed catalogue). ---
    //     Small (a handful of one-off hoops), so a Scan is fine — same as the
    //     tables above. Reservation state lives on the item itself and is moved
    //     only by conditional writes; see lambda/src/lib/shopDb.ts.
    const productsTable = new dynamodb.Table(this, 'ProductsTable', {
      tableName: 'flowsha-products',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // --- DynamoDB table for orders. ---
    //     The partition key is the Stripe Checkout Session id, which makes the
    //     webhook idempotent for free: a replayed event hits the same item and
    //     its conditional update simply no-ops.
    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: 'flowsha-orders',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // --- S3 bucket for product photos, uploaded from the dashboard. ---
    //     DELIBERATELY SEPARATE from SiteBucket: deploy.yml runs
    //     `aws s3 sync --delete` against the site bucket on every release, which
    //     would wipe every product photo. Served via the /media/* CloudFront
    //     behaviour below.
    const mediaBucket = new s3.Bucket(this, 'MediaBucket', {
      bucketName: `${SITE_DOMAIN}-media`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      // The dashboard uploads straight to S3 with a presigned PUT, which is a
      // cross-origin request from the browser and needs this to succeed.
      cors: [
        {
          allowedOrigins: [
            `https://${SITE_DOMAIN}`,
            `https://www.${SITE_DOMAIN}`,
            'http://localhost:3000',
          ],
          allowedMethods: [s3.HttpMethods.PUT],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
    });

    // --- Contact-form Lambda (SES email). Built by `npm run build -w lambda`. ---
    const handlerFn = new lambda.Function(this, 'ContactApi', {
      functionName: 'flowsha-contact',
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset('../lambda/dist/handler'),
      // 512 MB gets proportionally more CPU, so the handler finishes sooner and
      // often costs *less* per invocation than 256 MB. 15 s leaves room for the
      // Stripe API round-trip on a cold start.
      memorySize: 512,
      timeout: cdk.Duration.seconds(15),
      environment: {
        TO_EMAIL,
        FROM_EMAIL,
        AWS_SES_REGION: SES_REGION,
        // Used to build Stripe Checkout success/cancel redirect URLs.
        SITE_URL: `https://${SITE_DOMAIN}`,
        // Cloudflare Turnstile: the Lambda reads this SSM SecureString at runtime.
        // Create it once (never in code): see DEPLOYMENT.md. No per-deploy env needed.
        TURNSTILE_SECRET_PARAM: TURNSTILE_SECRET_PARAM,
        // Feedback survey submissions are written here (POST /feedback).
        FEEDBACK_TABLE_NAME: feedbackTable.tableName,
        // Signed waivers are written here (POST /waiver) + read for the dashboard.
        WAIVER_TABLE_NAME: waiverTable.tableName,
        // Clerk auth for the private dashboard's authenticated GET /feedback.
        CLERK_ISSUER,
        DASHBOARD_ALLOWED_EMAILS,
        // --- Shop ---
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        ORDERS_TABLE_NAME: ordersTable.tableName,
        MEDIA_BUCKET_NAME: mediaBucket.bucketName,
        // Public URL prefix for uploaded photos, served off the same distribution.
        MEDIA_BASE_URL: `https://${SITE_DOMAIN}/media`,
        STRIPE_SECRET_PARAM,
        STRIPE_WEBHOOK_SECRET_PARAM,
      },
    });

    handlerFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      }),
    );

    // --- Feedback: write submissions (POST /feedback) + read them back for the
    //     authenticated dashboard (GET /feedback). ---
    feedbackTable.grantReadWriteData(handlerFn);

    // --- Waivers: write signed forms (POST /waiver) + read them back for the
    //     authenticated dashboard (GET /waiver). ---
    waiverTable.grantReadWriteData(handlerFn);

    // --- Shop: read/write the catalogue and orders. ---
    productsTable.grantReadWriteData(handlerFn);
    ordersTable.grantReadWriteData(handlerFn);

    // --- Shop: sign presigned PUTs for dashboard photo uploads. ---
    mediaBucket.grantPut(handlerFn);
    mediaBucket.grantDelete(handlerFn);

    // --- Read the Turnstile secret (SSM SecureString) at runtime. ---
    handlerFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ssm:GetParameter'],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter${TURNSTILE_SECRET_PARAM}`,
          `arn:aws:ssm:${this.region}:${this.account}:parameter${STRIPE_SECRET_PARAM}`,
          `arn:aws:ssm:${this.region}:${this.account}:parameter${STRIPE_WEBHOOK_SECRET_PARAM}`,
        ],
      }),
    );
    // Decrypt the SecureString. Scoped to SSM-mediated calls so it can't be used elsewhere.
    handlerFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['kms:Decrypt'],
        resources: ['*'],
        conditions: { StringEquals: { 'kms:ViaService': `ssm.${this.region}.amazonaws.com` } },
      }),
    );

    // --- Function URL (no API Gateway). CORS allows the live site + local dev. ---
    const fnUrl = handlerFn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: [
          `https://${SITE_DOMAIN}`,
          `https://www.${SITE_DOMAIN}`,
          'http://localhost:3000',
        ],
        // POST for the forms + checkout; GET for authenticated reads; PATCH for
        // the dashboard's order/product mutations.
        allowedMethods: [lambda.HttpMethod.POST, lambda.HttpMethod.GET, lambda.HttpMethod.PATCH],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: cdk.Duration.seconds(86400),
      },
    });

    // --- S3 bucket for the static site (private; served only via CloudFront). ---
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `${SITE_DOMAIN}-site`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // --- Clean-URL rewrite: `/about/` and `/about` → `/about/index.html`. ---
    const rewriteFn = new cloudfront.Function(this, 'RewriteFn', {
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.includes('.')) {
    request.uri = uri + '/index.html';
  }
  return request;
}
      `),
    });

    // --- CloudFront distribution (OAC; redirect to HTTPS). ---
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          { function: rewriteFn, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      // Product photos, from the separate media bucket. Keys are stored with a
      // `media/` prefix so the path pattern maps straight through. The clean-URL
      // rewrite function is deliberately NOT attached here — these are real files.
      additionalBehaviors: {
        '/media/*': {
          origin: origins.S3BucketOrigin.withOriginAccessControl(mediaBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html' },
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html' },
      ],
      // --- Custom domain: apex + www, served on the us-east-1 ACM cert above. ---
      domainNames: [SITE_DOMAIN, `www.${SITE_DOMAIN}`],
      certificate: acm.Certificate.fromCertificateArn(this, 'Cert', CLOUDFRONT_CERT_ARN),
    });

    // --- GitHub Actions OIDC deploy role (used by .github/workflows/deploy.yml). ---
    //     Lets the JorenNagels/flowsha repo assume a role with no long-lived keys.
    const githubOidc = new iam.OpenIdConnectProvider(this, 'GitHubOidc', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });

    const deployRole = new iam.Role(this, 'GitHubActionsDeployRole', {
      roleName: 'GitHubActionsDeployRole',
      description: 'Assumed by GitHub Actions to update the Lambda, sync the site, invalidate CDN',
      assumedBy: new iam.WebIdentityPrincipal(githubOidc.openIdConnectProviderArn, {
        StringEquals: { 'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com' },
        StringLike: { 'token.actions.githubusercontent.com:sub': 'repo:JorenNagels/flowsha:*' },
      }),
    });

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['lambda:UpdateFunctionCode'],
        resources: [handlerFn.functionArn],
      }),
    );
    siteBucket.grantReadWrite(deployRole); // s3 sync --delete needs list + RW on objects
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
        ],
      }),
    );

    // --- Outputs (wire these into GitHub Actions secrets/vars). ---
    new cdk.CfnOutput(this, 'DeployRoleArn', {
      value: deployRole.roleArn,
      description: 'GitHub Actions deploy role ARN',
    });
    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: fnUrl.url,
      description: 'Contact Lambda Function URL → NEXT_PUBLIC_CONTACT_API_URL',
    });
    new cdk.CfnOutput(this, 'FeedbackTableName', {
      value: feedbackTable.tableName,
      description: 'DynamoDB table holding /feedback survey submissions',
    });
    new cdk.CfnOutput(this, 'WaiverTableName', {
      value: waiverTable.tableName,
      description: 'DynamoDB table holding /waiver signed submissions',
    });
    new cdk.CfnOutput(this, 'ProductsTableName', {
      value: productsTable.tableName,
      description: 'DynamoDB table holding ready-made hoops',
    });
    new cdk.CfnOutput(this, 'OrdersTableName', {
      value: ordersTable.tableName,
      description: 'DynamoDB table holding shop orders',
    });
    new cdk.CfnOutput(this, 'MediaBucketName', {
      value: mediaBucket.bucketName,
      description: 'S3 bucket for product photos (NOT synced by deploy.yml)',
    });
    new cdk.CfnOutput(this, 'SiteBucketName', {
      value: siteBucket.bucketName,
      description: 'S3 bucket for `aws s3 sync`',
    });
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution id for invalidation',
    });
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront URL (use until the custom domain is set up)',
    });
  }
}
