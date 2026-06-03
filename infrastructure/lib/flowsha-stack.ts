import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

// --- Config (swap when the real domain is bought) ---
const SITE_DOMAIN = 'flowsha.co.uk';
const TO_EMAIL = process.env.TO_EMAIL || 'hello@flowsha.co.uk';
const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@flowsha.co.uk';
const SES_REGION = process.env.AWS_SES_REGION || 'eu-west-2';

export class FlowshaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- Contact-form Lambda (SES email). Built by `npm run build -w lambda`. ---
    const handlerFn = new lambda.Function(this, 'ContactApi', {
      functionName: 'flowsha-contact',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset('../lambda/dist/handler'),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        TO_EMAIL,
        FROM_EMAIL,
        AWS_SES_REGION: SES_REGION,
        ALLOWED_ORIGIN: `https://${SITE_DOMAIN}`,
      },
    });

    handlerFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
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
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ['Content-Type'],
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
      defaultRootObject: 'index.html',
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html' },
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html' },
      ],
      // --- When the real domain is ready, add a us-east-1 ACM cert + Route 53/registrar
      //     CNAME and uncomment: ---
      // domainNames: [SITE_DOMAIN],
      // certificate: acm.Certificate.fromCertificateArn(this, 'Cert', '<us-east-1 cert arn>'),
    });

    // --- Outputs (wire these into GitHub Actions secrets/vars). ---
    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: fnUrl.url,
      description: 'Contact Lambda Function URL → NEXT_PUBLIC_CONTACT_API_URL',
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
