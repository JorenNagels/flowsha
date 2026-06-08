# CLAUDE.md — Flowsha

Guidance for Claude (and humans) working in this repo.

## What this is

Marketing website for **Flowsha** — Osha's hula-hoop business (classes,
performances, handmade hoops). Priorities, in order: **SEO**, fast/cheap static hosting,
and a working contact/booking form. A hoop **ordering/ecommerce** backend comes later.

**Status:** live in production at <https://flowsha.co.uk> (S3 + CloudFront; contact form
on Lambda + SES; released via `v*.*.*` tags). Account IDs, resource inventory, the deploy
flow, and SES state are in **[DEPLOYMENT.md](./DEPLOYMENT.md)** — read it before touching
infra or DNS.

The stack deliberately mirrors two sibling projects:

- **`../portfolio-elliot`** — the frontend template (Next.js static export + Tailwind +
  `next-image-export-optimizer`). We clone its config/patterns but **invert its SEO**
  (it blocks indexing; we want to be indexed).
- **`../../se-parti/se-parti-rsvp`** — the backend/deploy template (AWS Lambda Function
  URL + SES + CDK + GitHub Actions + S3/CloudFront). We clone its patterns for the
  contact form and lay groundwork for ordering.

## Architecture

```
flowsha-hoops/                npm-workspaces monorepo
├── web/                      Next.js 16 static export (output:'export')  → S3 + CloudFront
│   ├── src/app/              App Router pages + layout + sitemap.ts + robots.ts
│   ├── src/components/       Nav, Hero, Footer, FadeIn, ContactForm, etc.
│   ├── src/lib/data.ts       All site content (typed) — edit copy here
│   ├── public/images/        OPTIMISED web images only (hero/ gallery/ about/)
│   └── next.config.mjs       static export + next-image-export-optimizer config
├── lambda/                   Contact/booking handler (SES email)  → Lambda Function URL
│   └── src/handler.ts        Route table: POST /contact (add /orders later)
├── infrastructure/           AWS CDK: Lambda, S3, CloudFront, ACM cert, GitHub OIDC role
├── scripts/prep-images.mjs   one-time sharp downscale of raw img/ → web/public/images
└── .github/workflows/        deploy.yml (prod, on tag v*.*.*) + pages.yml (staging preview)
```

- Frontend is **fully static**. The browser calls the **Lambda Function URL** directly
  (`NEXT_PUBLIC_CONTACT_API_URL`) for form submissions — same pattern as se-parti's SPA.
- One Lambda, one route now (`POST /contact`). Keep the route-table shape from
  se-parti `lambda/src/handler.ts` so `/orders`, `/checkout` slot in later.

## Tech stack

| Concern   | Choice                                                              |
| --------- | ------------------------------------------------------------------- |
| Framework | Next.js ^16 App Router, `output: 'export'`, `trailingSlash: true`   |
| Language  | TypeScript strict, path alias `@/*`                                 |
| Styling   | Tailwind ^3.4 + minimal `globals.css`                               |
| Images    | `next-image-export-optimizer` (build-time WebP + srcset + blur)     |
| Fonts     | `next/font` (Fraunces, Nunito; Playlist Script local once provided) |
| Backend   | Node 20 Lambda, `@aws-sdk/client-ses`, `zod`, esbuild bundle        |
| Infra     | `aws-cdk-lib` ^2                                                    |
| CI/CD     | GitHub Actions on tag `v*.*.*`                                      |

## Design system

- **Colours** (Tailwind theme — natural/earthy from the brand brief): `cream` (bg),
  `forest`/`sage` green, `clay`/brown, `terracotta`/orange, `mustard`. Dark text on cream.
- **Fonts:** **Fraunces** (display, organic serif), **Nunito** (body). The brand's
  **Playlist Script** is not on Google Fonts — wire via `next/font/local` when the
  `.woff2` is supplied; fall back to Fraunces italic for the "Find your flow" tagline.
- **Visual language:** organic curves, circular/looping motifs, whitespace, the hooping
  photography as hero. Logo is a placeholder SVG (looping curved line) until a real one
  exists.

## SEO (the whole point — do not regress)

- Per-page `metadata` exports: unique `title`, `description`, `openGraph`, `twitter`,
  `alternates.canonical`. Root `metadataBase = https://flowsha.co.uk`, `lang="en-GB"`.
- `app/sitemap.ts` and `app/robots.ts` — **allow indexing** (opposite of portfolio).
- **JSON-LD structured data**: `LocalBusiness` (layout), `Service`+`offers` (/workshops),
  `Product` (/shop), `Review`/`AggregateRating` (testimonials), `BreadcrumbList`.
- Semantic HTML, one `<h1>` per page, descriptive `alt` on every image, OG share image.
- Content is data-driven in `web/src/lib/data.ts`.

## Hosting cost rules — keep it at $0

At this scale AWS bills effectively **$0.00** (same as the sibling se-parti sites). Keep it
that way:

- **CloudFront** (1 TB/mo) and **Lambda** (1M req/mo) are **free forever** — the
  traffic-scaling parts. No cliff.
- **S3** and **SES** round to $0.00 at this volume **only if** we never deploy the raw
  863 MB of originals. Deploy **optimised WebP only**; raw `img/` is gitignored and never
  synced to S3.
- **Route 53** hosts `flowsha.co.uk` — the domain was registered there, so the hosted zone
  (~$0.50/mo) is the one intentional deviation from $0. Accepted because it keeps ACM
  validation, the CloudFront alias, and all SES DNS (DKIM + custom MAIL FROM) in one place.
  Don't add *more* hosted zones, and the cost discipline above still applies.

## Conventions

- Match `../portfolio-elliot` style: Prettier (single quotes, width 100,
  `prettier-plugin-tailwindcss`), Tailwind utility-first, client components only when they
  need hooks/interactivity (`'use client'`), reuse the `FadeIn` IntersectionObserver
  pattern for scroll reveals.
- Edit site copy in `web/src/lib/data.ts`, not in components.
- Images: add raw originals to `img/`, run `scripts/prep-images.mjs`, reference the
  optimised files under `web/public/images/...` via `<ExportedImage>`.

## Placeholders / launch checklist

**Resolved (live):** domain `flowsha.co.uk` (registered + DNS in Route 53),
`TO_EMAIL`/`FROM_EMAIL` = `hello@flowsha.co.uk` (Zoho mailbox), Instagram URL in
`site.ts`/`data.ts`.

**Still outstanding:**

- **Logo** — placeholder SVG (looping curved line) until a real logo exists.
- **Playlist Script font** — wire via `next/font/local` when the `.woff2` is supplied;
  falls back to Fraunces italic for the "Find your flow" tagline.
- **SES production access** — request pending (see [DEPLOYMENT.md](./DEPLOYMENT.md)). Until
  it's granted, the customer auto-reply only reaches verified addresses; owner
  notifications already work.

## Future: hoop ordering

Extend the existing Lambda (don't add a new service): add `/orders` + `/checkout` routes,
a **DynamoDB** orders table, and **Stripe** for payment — following se-parti's
`lambda/src/handler.ts` route table and `infrastructure/lib/rsvp-stack.ts` DynamoDB +
SES patterns. The `/shop` page is a static "enquire to order" catalogue until then.

## Common commands

```bash
npm run dev -w web        # Next dev server (http://localhost:3000)
npm run dev -w lambda     # contact Lambda dev server (http://localhost:3001)
npm run build -w web      # prep-images + optimizer + next build → web/out
cd infrastructure && npx cdk synth   # validate infra

# --- deploy (all AWS commands need the flowsha SSO profile) ---
aws sso login --profile flowsha                          # re-auth (token expires)
cd infrastructure && AWS_PROFILE=flowsha npx cdk deploy   # ship infra changes
git tag vX.Y.Z && git push origin vX.Y.Z                  # release prod (deploy.yml)
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full deploy/SES/DNS runbook.
