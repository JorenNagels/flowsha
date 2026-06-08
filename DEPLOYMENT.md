# Deployment & operations — Flowsha

The site is **live in production**: <https://flowsha.co.uk> (and `www.`), served from
S3 + CloudFront in a dedicated AWS account. This file is the operational reference:
the resource inventory, the deploy flow, and the runbooks for the things you'll actually
need to do. Architecture/conventions live in [CLAUDE.md](./CLAUDE.md).

## AWS account & access

| | |
| --- | --- |
| **Account** | `616853831644` (dedicated Flowsha account in the org — **not** any work account) |
| **Login** | IAM Identity Center (SSO). Portal: <https://d-99674bc0ba.awsapps.com/start> |
| **CLI profile** | `flowsha` — **prefix every AWS/CDK command with `AWS_PROFILE=flowsha`** |
| **Region** | `eu-west-2` (London). CloudFront ACM cert is in `us-east-1` (required). |

The SSO token expires (re-auth each day/session):

```bash
aws sso login --profile flowsha          # opens the browser
aws sts get-caller-identity --profile flowsha   # should show account 616853831644
```

If the SSO *session* itself has lapsed, re-run `aws configure sso --profile flowsha`.

## Deployed resources (`FlowshaHoopsStack`)

| Resource | Value |
| --- | --- |
| S3 site bucket | `flowsha.co.uk-site` (private; CloudFront OAC only) |
| CloudFront | `d18yhmfqqkhedc.cloudfront.net` · distribution `E3VZCH84OH2M69` |
| Custom domain | `flowsha.co.uk` + `www.flowsha.co.uk` (A/AAAA alias → CloudFront) |
| ACM cert (us-east-1) | `arn:aws:acm:us-east-1:616853831644:certificate/17f21f31-1d36-465e-85fe-a5a13064bdab` |
| Contact Lambda | `flowsha-contact` (Node 20, ARM64) |
| Function URL | `https://nnvpku3nf5prtb4zgxvcgbt2ey0qzhjr.lambda-url.eu-west-2.on.aws/` |
| Route 53 hosted zone | `Z1025669GIFEEZTK76FJ` (domain registered in Route 53, this account) |
| GitHub OIDC deploy role | `arn:aws:iam::616853831644:role/GitHubActionsDeployRole` |

> The Function URL ends in `/`; the frontend strips the trailing slash before appending
> `/contact` (a `//contact` path 404s). Keep `CONTACT_API_URL` **without** a trailing slash.

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
- **Sandbox status:** as of the last release SES is still in the **sandbox**, with a
  **production-access request pending** (support case `178080788200578`). Until it's
  granted, the auto-reply only delivers to verified addresses; the owner notification
  works because the whole domain is verified. Approval is an account-level flip — **no
  code change or redeploy needed**. Check with:

  ```bash
  AWS_PROFILE=flowsha aws sesv2 get-account --region eu-west-2 \
    --query "{Production:ProductionAccessEnabled,Review:Details.ReviewDetails}"
  ```

  On the Basic support plan the case can only be answered in the AWS Support Center
  console (the Support API is blocked).

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
