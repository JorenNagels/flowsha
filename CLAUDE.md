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
├── shared/                   @flowsha/shared — types, price table, quote() (web AND lambda)
├── web/                      Next.js 16 static export (output:'export')  → S3 + CloudFront
│   ├── src/app/              App Router pages + layout + sitemap.ts + robots.ts
│   ├── src/components/       Nav, Hero, Footer, FadeIn, ContactForm, etc.
│   ├── src/lib/data.ts       All site content (typed) — edit copy here
│   ├── public/images/        OPTIMISED web images only (hero/ gallery/ about/)
│   └── next.config.mjs       static export + next-image-export-optimizer config
├── lambda/                   API handler (SES, DynamoDB, Stripe)  → Lambda Function URL
│   ├── src/handler.ts        Route table (`METHOD /path` → fn)
│   ├── src/routes/           forms.ts · shop.ts · admin.ts
│   └── src/lib/              http · ses · db · shopDb · stripe · clerk · turnstile · secrets
├── infrastructure/           AWS CDK: Lambda, S3, CloudFront, ACM cert, GitHub OIDC role
├── scripts/prep-images.mjs   one-time sharp downscale of raw img/ → web/public/images
└── .github/workflows/        deploy.yml (prod, on tag v*.*.*) + pages.yml (staging preview)
```

- Frontend is **fully static**. The browser calls the **Lambda Function URL** directly
  (`NEXT_PUBLIC_CONTACT_API_URL`) for form submissions — same pattern as se-parti's SPA.
- One Lambda, one Function URL, fourteen routes, dispatched from a `METHOD /path`
  table in `lambda/src/handler.ts`. Add routes there, and put the handler in the
  matching `src/routes/` module — not in `handler.ts` itself.

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

- **Colours** — the palette is taken from the logo, which is exactly two colours: a green
  figure (`#4c7252` = `forest`) and a burnt-orange hoop (`#d3793b` = `terracotta`). The
  page canvas is `forest-dark` with `cream` type, so **orange needs three steps** and
  picking the wrong one is a contrast bug:
  - `terracotta` — the logo orange. Graphics, fills, and display type 24px+. Only 3.5:1
    on the canvas, so **never** small text.
  - `terracotta-light` — 4.9:1 on the canvas. Small text, labels, links, borders, and
    button fills paired with `text-forest-dark`.
  - `terracotta-deep` — 4.6:1 under cream. Solid orange blocks carrying cream text: the
    primary CTA and every form submit button.

  Supporting: `cream`, `sand`, `ink`, `sage`, `clay`. **`mustard` is retired** — the logo
  has no yellow. It stays defined only so the internal `/styles` prototype gallery keeps
  rendering; do not use it in live components.

- **Fonts:** **Fraunces** (display, organic serif), **Nunito** (body). The brand's
  **Playlist Script** is not on Google Fonts — wire via `next/font/local` when the
  `.woff2` is supplied; fall back to Fraunces italic for the "Find your flow" tagline.
- **Visual language:** organic curves, circular/looping motifs, whitespace, the hooping
  photography as hero.
- **Logo** — source of truth is `brand/logo.svg` (a dancing figure with a hoop and a
  spiral sun). Every derived asset is generated by `npm run prep-brand`, never hand-edited:
  two SVG colourways in `web/public/brand/`, the favicon (`web/src/app/icon.svg`, the
  spiral sun alone — the full figure is unreadable below ~44px), the Apple touch icon, and
  a PNG for email templates. Use the `<Logo>`/`<LogoMark>` components and pick `tone`
  correctly: the green figure is invisible on `forest-dark`, so dark backgrounds need
  `tone="cream"`.

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
  Don't add _more_ hosted zones, and the cost discipline above still applies.

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
`site.ts`/`data.ts`, **logo** (`brand/logo.svg`, rolled out across nav/footer/favicon/
Apple icon/email; palette re-derived from it and `mustard` retired).

**Still outstanding:**

- **OG share image** — `web/public/images/og/flowsha-og.jpg` is a plain photo with no
  logo or wordmark. Worth regenerating now the mark exists.
- **Stripe Checkout branding** — upload the logo and set the brand colours when the
  Stripe account is live, so the payment page doesn't look like a different company.
- **Real shop prices** — every price in `shared/src/pricing.ts` is a `9999` placeholder,
  and `PRICES_ARE_REAL` is `false` (which shows a warning on the product pages).
- **Trading address** — `TRADING_ADDRESS` in `web/src/lib/data.ts` is a placeholder and
  is legally required to be publicly visible.
- **Playlist Script font** — wire via `next/font/local` when the `.woff2` is supplied;
  falls back to Fraunces italic for the "Find your flow" tagline.
- **SES production access** — request pending (see [DEPLOYMENT.md](./DEPLOYMENT.md)). Until
  it's granted, the customer auto-reply only reaches verified addresses; owner
  notifications already work.

## The shop

**Built, not yet launched.** `/shop` is a real shop: two made-to-order products with a
configurator, dashboard-managed ready-made stock, a cart, Stripe Checkout, and order
management. It cannot go live until the blockers in `docs/SHOP-PLAN.md` §14 are cleared —
above all **real prices** (everything is a `9999` placeholder) and **SES production
access**, without which customers get no order confirmation, which is a legal requirement.

Rules that are load-bearing, not stylistic:

- **`@flowsha/shared` owns money.** The price table, option lists and `quote()` live in
  `shared/src/` and are imported by both workspaces. The browser's total is display-only;
  the Lambda re-prices every basket with the same `quote()` before creating a Stripe
  session. **Never** create a session from a client-supplied price. The checkout schema
  has no price field at all, and zod strips one if a client invents it.
- **All money is integer pence.** Never floats.
- **Stripe is called over `fetch`, not the npm SDK** (`lambda/src/lib/stripe.ts`). The SDK
  would add ~1 MB to every cold start for two API calls. Webhook signatures are verified
  against the **raw** body — `parseBody` must never touch that route.
- **Reservations are conditional writes, not TTL.** `reserveAndCreateOrder` holds the
  ready-made hoops and writes the order in one `TransactWriteItems`, and its condition
  treats an expired hold as available. DynamoDB TTL can lag 48 hours; correctness must not
  depend on a sweeper.
- **Webhooks are idempotent by construction.** The order id is our own uuid, passed to
  Stripe as metadata; `markOrderPaid` is conditional on `status = 'pending'`, so a replayed
  event no-ops and does not re-send emails.
- **The media bucket is separate from the site bucket.** `deploy.yml` runs
  `aws s3 sync --delete` against the site bucket, which would erase every product photo.
- **No VAT anywhere, and no child-facing copy.** Flowsha is a sole trader below the
  threshold, and marketing a hoop at under-14s pulls it under the Toys (Safety)
  Regulations 2011. "Kids' Hoops" was removed for that reason and must not come back.
- **The 14-day cancellation right applies to everything**, including configured hoops —
  the bespoke exemption does not cover goods assembled from standard stock options.

## Common commands

```bash
npm run dev -w web        # Next dev server (http://localhost:3000)
npm run dev -w lambda     # contact Lambda dev server (http://localhost:3001)
npm run build -w web      # prep-images + optimizer + next build → web/out
cd infrastructure && CLERK_ISSUER=https://clerk.flowsha.co.uk npx cdk synth   # validate infra
npx tsc --noEmit -p shared/tsconfig.json   # typecheck the shared price/quote module
stripe listen --forward-to localhost:3001/stripe-webhook   # webhook testing

# --- deploy (all AWS commands need the flowsha SSO profile) ---
aws sso login --profile flowsha                          # re-auth (token expires)
cd infrastructure && AWS_PROFILE=flowsha npx cdk deploy   # ship infra changes
git tag vX.Y.Z && git push origin vX.Y.Z                  # release prod (deploy.yml)
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full deploy/SES/DNS runbook.
