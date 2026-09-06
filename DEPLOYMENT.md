# Deployment & operations — Flowsha

The site is **live in production**: <https://flowsha.co.uk> (and `www.`), served from
S3 + CloudFront in a dedicated AWS account. This file is the operational reference:
the resource inventory, the deploy flow, and the runbooks for the things you'll actually
need to do. Architecture/conventions live in [CLAUDE.md](./CLAUDE.md).

## AWS account & access

|                 |                                                                                  |
| --------------- | -------------------------------------------------------------------------------- |
| **Account**     | `616853831644` (dedicated Flowsha account in the org — **not** any work account) |
| **Login**       | IAM Identity Center (SSO). Portal: <https://d-99674bc0ba.awsapps.com/start>      |
| **CLI profile** | `flowsha` — **prefix every AWS/CDK command with `AWS_PROFILE=flowsha`**          |
| **Region**      | `eu-west-2` (London). CloudFront ACM cert is in `us-east-1` (required).          |

The SSO token expires (re-auth each day/session):

```bash
aws sso login --profile flowsha          # opens the browser
aws sts get-caller-identity --profile flowsha   # should show account 616853831644
```

If the SSO _session_ itself has lapsed, re-run `aws configure sso --profile flowsha`.

## Deployed resources (`FlowshaHoopsStack`)

| Resource                | Value                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| S3 site bucket          | `flowsha.co.uk-site` (private; CloudFront OAC only)                                                            |
| CloudFront              | `d18yhmfqqkhedc.cloudfront.net` · distribution `E3VZCH84OH2M69`                                                |
| Custom domain           | `flowsha.co.uk` + `www.flowsha.co.uk` (A/AAAA alias → CloudFront)                                              |
| ACM cert (us-east-1)    | `arn:aws:acm:us-east-1:616853831644:certificate/17f21f31-1d36-465e-85fe-a5a13064bdab`                          |
| API Lambda              | `flowsha-contact` (Node 22, ARM64, 512 MB, 15 s)                                                               |
| Function URL            | `https://nnvpku3nf5prtb4zgxvcgbt2ey0qzhjr.lambda-url.eu-west-2.on.aws/`                                        |
| DynamoDB                | `flowsha-feedback` · `flowsha-waiver` · `flowsha-products` · `flowsha-orders` (all PK `id`, on-demand, RETAIN) |
| S3 media bucket         | `flowsha.co.uk-media` (product photos; served via the `/media/*` CloudFront behaviour)                         |
| Route 53 hosted zone    | `Z1025669GIFEEZTK76FJ` (domain registered in Route 53, this account)                                           |
| GitHub OIDC deploy role | `arn:aws:iam::616853831644:role/GitHubActionsDeployRole`                                                       |

> The Function URL ends in `/`; the frontend strips the trailing slash before appending
> `/contact` (a `//contact` path 404s). Keep `CONTACT_API_URL` **without** a trailing slash.

> ⚠️ **The media bucket must never be synced by `deploy.yml`.** That workflow runs
> `aws s3 sync --delete` against the _site_ bucket; pointing it at the media bucket, or
> moving photos into the site bucket, would delete every product photo on each release.

> ⚠️ **CI cannot create infrastructure.** `GitHubActionsDeployRole` holds only
> `lambda:UpdateFunctionCode`, S3 read/write on the site bucket, and
> `cloudfront:CreateInvalidation`. Any new table, bucket or SSM parameter needs a local
> `AWS_PROFILE=flowsha npx cdk deploy` **before** you push the release tag.

## CI/CD — automated deploy

`deploy.yml` runs on a `v*.*.*` tag (or manual `workflow_dispatch`) and assumes the OIDC
role — **no long-lived AWS keys anywhere**. It builds + updates the Lambda, builds the
site, syncs to S3 (immutable assets / no-cache HTML), and invalidates CloudFront.

Repo `JorenNagels/flowsha` — Actions **secret**:

- `AWS_ACCOUNT_ID` = `616853831644`

…and Actions **variables**:

- `CONTACT_API_URL` = the Function URL (no trailing slash)
- `S3_BUCKET` = `flowsha.co.uk-site`
- `CLOUDFRONT_DISTRIBUTION_ID` = `E3VZCH84OH2M69`
- `TURNSTILE_SITE_KEY` = Cloudflare Turnstile **site** key (public; baked into the build)

## Spam protection — Cloudflare Turnstile

The contact form runs an **invisible** Cloudflare Turnstile widget; the Lambda verifies
the token (`lambda/src/lib/turnstile.ts`) before sending any email. Free, no Google.

- **Site key** (public) → GitHub Actions variable `TURNSTILE_SITE_KEY` (above), injected
  as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` at build time.
- **Secret key** → SSM SecureString **`/flowsha/turnstile-secret`** in `eu-west-2`. The
  Lambda reads + caches it at runtime (CDK grants `ssm:GetParameter` + scoped `kms:Decrypt`
  and sets `TURNSTILE_SECRET_PARAM`). **Never** put the secret in code or env files.

Create / rotate the secret (then `cdk deploy` so the IAM grant exists):

```bash
aws ssm put-parameter --profile flowsha --region eu-west-2 \
  --name /flowsha/turnstile-secret --type SecureString \
  --value '<turnstile-secret-key>' --overwrite
```

**Fail-safe behaviour:** if neither the secret param nor an inline `TURNSTILE_SECRET_KEY`
(dev only) is set, verification is skipped and submissions pass through — so the local dev
Lambda works with no config. Production protection is only as live as that SSM parameter.

**Checkout uses a second, different site key.** Whether a Turnstile widget is an invisible
check or a visible checkbox is a property of the _site key_, set in the Cloudflare
dashboard — not a render option. Create a second **Managed** widget for checkout and set
its site key as the GitHub Actions variable `TURNSTILE_CHECKOUT_SITE_KEY`
(→ `NEXT_PUBLIC_TURNSTILE_CHECKOUT_SITE_KEY`). Both keys share the one secret above.

## Stripe (shop payments)

Hosted Stripe Checkout: the customer is redirected to Stripe, so no card data touches
this site (SAQ-A). The Lambda talks to Stripe's REST API over `fetch` — there is no
`stripe` npm dependency to keep updated.

Two SSM SecureStrings in `eu-west-2`, created out of band exactly like the Turnstile
secret. CDK only references the names and grants `ssm:GetParameter` on them.

```bash
# Secret key: Stripe dashboard → Developers → API keys.
aws ssm put-parameter --profile flowsha --region eu-west-2 \
  --name /flowsha/stripe-secret-key --type SecureString \
  --value 'sk_live_...' --overwrite

# Webhook signing secret: created when you add the endpoint below.
aws ssm put-parameter --profile flowsha --region eu-west-2 \
  --name /flowsha/stripe-webhook-secret --type SecureString \
  --value 'whsec_...' --overwrite
```

**Webhook endpoint.** In the Stripe dashboard, add an endpoint pointing at the Function
URL + `/stripe-webhook`, subscribed to `checkout.session.completed` and
`checkout.session.expired`. The first marks the order paid and the hoops sold; the
second releases the reservation. Both are idempotent, so Stripe's retries are safe.

**Fail-safe behaviour:** with no key configured, `POST /checkout` returns a clear 503 and
the rest of the site is unaffected.

**Payouts:** leave on the default rolling schedule. Standard UK payouts are free — only
_Instant_ Payouts cost anything (1%, min £1.00).

**Before going live:** upload the logo and set brand colours in the Stripe dashboard, so
the payment page doesn't look like a different company.

**Cut a release:**

```bash
git tag vX.Y.Z && git push origin vX.Y.Z
gh run watch "$(gh run list --workflow deploy.yml -L1 --json databaseId -q '.[0].databaseId')" --exit-status
```

`pages.yml` separately publishes a **staging** preview to GitHub Pages
(`jorennagels.github.io/flowsha`, built with `basePath=/flowsha`) on every push to `main`.
It does not touch production.

## SES (contact form email)

- **Identity:** domain `flowsha.co.uk`, DKIM = SUCCESS. Mailbox is **Zoho** (`hello@`,
  root MX → `mx.zoho.com`). Sends **from** and notifies **to** `hello@flowsha.co.uk`.
- **Custom MAIL FROM:** `send.flowsha.co.uk` (MX → `feedback-smtp.eu-west-2.amazonses.com`,
  SPF `v=spf1 include:amazonses.com ~all`) so SPF aligns alongside DKIM. Fallback is
  `USE_DEFAULT_VALUE`, so a MAIL-FROM hiccup can never block sending.
- **DMARC:** `_dmarc.flowsha.co.uk` already published (`p=none`, relaxed, reports → Gmail).
- **Two emails per submission** (`lambda/src/lib/ses.ts`): an owner notification (critical)
  and a styled customer auto-reply (best-effort — wrapped in try/catch so it can never
  break the visitor's submission).
- **Sandbox status:** SES is still in the **sandbox**. The production-access request
  (support case `178080788200578`) was **DENIED** — twice, most recently on 2026-06-08
  after a detailed appeal. Both denials were the generic boilerplate template ("could
  have a negative impact… for security purposes we cannot provide specific details"),
  which is an account-risk auto-flag, **not** a reaction to our (clean, transactional,
  user-initiated) use case. Until access is granted, the auto-reply only delivers to
  verified addresses; the owner notification works because the whole domain is verified.
  Approval is an account-level flip — **no code change or redeploy needed**. Check with:

  ```bash
  AWS_PROFILE=flowsha aws sesv2 get-account --region eu-west-2 \
    --query "{Production:ProductionAccessEnabled,Review:Details.ReviewDetails}"
  ```

  On the Basic support plan the case can only be read/answered in the AWS Support Center
  console (the Support API is blocked).

- **What still works in the sandbox:** the **owner notification** (→ verified
  `hello@flowsha.co.uk`) delivers normally, so no enquiry is lost. The **only** casualty
  is the customer auto-reply to unverified visitor addresses.
- **Paths to unblock** (re-arguing the same case just re-sends the template):
  1. Let the account age with some billing history, then file a **fresh** request cold
     (not as a reply to the denied case) — account risk score is the likeliest cause.
  2. Open a **new** case (Service limit increase → SES) asking for the specific policy
     basis for the denial of `178080788200578`, to route it off the boilerplate queue.
  3. Request in a **different region** (e.g. `eu-west-1`) — different reviewer/automation.
  4. Pragmatic fallback: route **only** the customer auto-reply through a transactional
     provider with a trivial approval bar (Resend/Postmark/Mailgun free tier), keep SES
     for the owner notification. Deviates from the se-parti/SES pattern — decide before
     doing.
  - Draft escalation text (for path 2) is kept at `docs/ses-production-appeal.md`.

## Runbooks

**Manual full deploy (bypassing the tag flow):**

```bash
npm run build -w lambda
cd infrastructure && AWS_PROFILE=flowsha npx cdk deploy   # only if infra changed
# site:
NEXT_PUBLIC_CONTACT_API_URL="https://nnvpku3nf5prtb4zgxvcgbt2ey0qzhjr.lambda-url.eu-west-2.on.aws" npm run build -w web
AWS_PROFILE=flowsha aws s3 sync web/out/ s3://flowsha.co.uk-site/ --exclude "*.html" --cache-control "public, max-age=31536000, immutable" --delete
AWS_PROFILE=flowsha aws s3 sync web/out/ s3://flowsha.co.uk-site/ --exclude "*" --include "*.html" --include "*.txt" --include "*.xml" --cache-control "public, must-revalidate, max-age=0"
AWS_PROFILE=flowsha aws cloudfront create-invalidation --distribution-id E3VZCH84OH2M69 --paths "/*"
```

**Change the Lambda's env (TO/FROM email, etc.):** edit `infrastructure/lib/flowsha-stack.ts`
(or the `TO_EMAIL`/`FROM_EMAIL`/`AWS_SES_REGION` env at deploy) and `cdk deploy`. The
tag-driven `deploy.yml` only does `update-function-code`, so env changes go through CDK.

**Smoke test:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://flowsha.co.uk/
curl -s -X POST "https://nnvpku3nf5prtb4zgxvcgbt2ey0qzhjr.lambda-url.eu-west-2.on.aws/contact" \
  -H "Content-Type: application/json" -H "Origin: https://flowsha.co.uk" \
  -d '{"name":"Test","email":"hello@flowsha.co.uk","enquiryType":"general","message":"smoke test"}'
```
