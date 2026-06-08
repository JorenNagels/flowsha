# Flowsha

Marketing website for **Flowsha** — hula-hoop classes, performances, and handmade
hoops. _Find your flow._

Static, SEO-optimised site (Next.js) with a serverless contact/booking form (AWS Lambda +
SES). Built to grow a hoop-ordering shop later.

**Live:** <https://flowsha.co.uk> · deploy & operations details in
[DEPLOYMENT.md](./DEPLOYMENT.md).

## Tech stack

- **Frontend:** Next.js 16 (static export) · TypeScript · Tailwind CSS ·
  `next-image-export-optimizer`
- **Backend:** AWS Lambda Function URL · Amazon SES (contact form email)
- **Infra:** AWS CDK · S3 + CloudFront
- **CI/CD:** GitHub Actions (deploy on git tag)

Monorepo (npm workspaces): `web/` (site), `lambda/` (contact API), `infrastructure/`
(CDK). See [CLAUDE.md](./CLAUDE.md) for architecture and conventions.

## Prerequisites

- Node.js 20+
- For deploy/infra: access to the Flowsha AWS account via the `flowsha` SSO profile
  (`aws sso login --profile flowsha`) and AWS CDK. Every AWS command takes
  `AWS_PROFILE=flowsha`.

## Local development

```bash
npm install                  # installs all workspaces

# Frontend (http://localhost:3000)
npm run dev -w web

# Contact-form Lambda (http://localhost:3001) — needs AWS creds + a verified SES address
npm run dev -w lambda
```

Set `web/.env.local`:

```
NEXT_PUBLIC_CONTACT_API_URL=http://localhost:3001   # local dev-server
```

In production this points at the deployed Lambda Function URL.

## Images

Drop full-size source photos in `img/` (gitignored — never committed or deployed). Then:

```bash
node scripts/prep-images.mjs        # downscales to ~2400px WebP-ready into web/public/images
npm run build -w web                # next-image-export-optimizer makes responsive WebP variants
```

Only the optimised images under `web/public/images/` ship — this is what keeps S3 free.

## Build

```bash
npm run build -w web        # → web/out (static site)
npx serve web/out          # preview the production build locally
```

## AWS setup (already done)

The infrastructure is deployed and CI/CD is live — see [DEPLOYMENT.md](./DEPLOYMENT.md)
for the full inventory, account/profile, SES state, and runbooks. In brief, the account
holds the `FlowshaHoopsStack` (Lambda + S3 + CloudFront + ACM cert), a GitHub OIDC deploy
role, and a verified SES domain identity (DKIM + custom MAIL FROM). GitHub Actions on
`JorenNagels/flowsha` is configured with:

- secret `AWS_ACCOUNT_ID`
- variables `CONTACT_API_URL` (the Function URL, **no trailing slash**), `S3_BUCKET`,
  `CLOUDFRONT_DISTRIBUTION_ID`

SES is still in the **sandbox** (production-access request pending), so the customer
auto-reply only reaches verified addresses until that's granted; owner notifications work.

## Deploy

Push a version tag (or run the workflow manually):

```bash
git tag v1.1.0 && git push origin v1.1.0   # current release: v1.0.0
```

GitHub Actions then assumes the OIDC role (no stored keys) and: builds + updates the
Lambda, builds `web/`, syncs to S3 (immutable assets / no-cache HTML), and invalidates
CloudFront. Every push to `main` also rebuilds the GitHub Pages **staging** preview.

## Cost

Effectively **$0/month** at small-business traffic: CloudFront (1 TB/mo) and Lambda
(1M req/mo) are free forever; S3 + SES round to $0.00 at this scale. The domain is
registered in **Route 53**, so its hosted zone (~$0.50/mo) and the domain registration
(~£8–12/yr) are the only real recurring costs. **Never deploy the raw originals** —
that's the one thing that would change this.

## Still to do before full launch

Done: domain `flowsha.co.uk` (live), contact emails (`hello@flowsha.co.uk` via Zoho),
Instagram URL. Outstanding:

- Real logo SVG (to replace the placeholder looping-line mark).
- Playlist Script font (`.woff2` → `next/font/local`).
- SES production access (request pending) so the customer auto-reply reaches all visitors.
