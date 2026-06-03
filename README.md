# Flowsha

Marketing website for **Flowsha** — hula-hoop classes, performances, and handmade
hoops. _Find your flow._

Static, SEO-optimised site (Next.js) with a serverless contact/booking form (AWS Lambda +
SES). Built to grow a hoop-ordering shop later.

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
- For deploy/infra: an AWS account + AWS CLI configured, and AWS CDK
  (`npm i -g aws-cdk`).

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

## One-time AWS setup

1. **CDK bootstrap & deploy** the infrastructure:
   ```bash
   npm run build -w lambda
   cd infrastructure && npx cdk deploy
   ```
   Note the outputs: **FunctionUrl**, **SiteBucketName**, **DistributionId**.
2. **Verify SES**: in the SES console (region `eu-west-2`), verify the sender
   (`FROM_EMAIL`) and recipient (`TO_EMAIL`) addresses (or the domain). New accounts are
   in the **SES sandbox** — request production access to email arbitrary recipients.
3. **GitHub repo secrets/vars**: `AWS_ACCOUNT_ID`, `NEXT_PUBLIC_CONTACT_API_URL`
   (the Function URL), plus the bucket name and distribution id from step 1.

## Deploy

Push a version tag (or run the workflow manually):

```bash
git tag v0.1.0 && git push origin v0.1.0
```

GitHub Actions then: builds + updates the Lambda, builds `web/`, syncs to S3 (immutable
assets / no-cache HTML), and invalidates CloudFront.

## Cost

Effectively **$0/month** at small-business traffic: CloudFront (1 TB/mo) and Lambda
(1M req/mo) are free forever; S3 + SES round to $0.00 at this scale. We avoid Route 53
($0.50/mo) by using the domain registrar's DNS. Only the domain registration (~£8–12/yr)
is a real recurring cost. **Never deploy the raw originals** — that's the one thing that
would change this.

## Things to replace before launch

- Domain `flowsha.co.uk` (placeholder).
- Contact `TO_EMAIL` / `FROM_EMAIL`.
- Instagram + Facebook URLs (`web/src/lib/data.ts`).
- Logo SVG and the Playlist Script font file.
