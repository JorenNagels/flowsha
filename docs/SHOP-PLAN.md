# Shop build — todo list

Plan for turning `/shop` from a static "enquire to order" catalogue into a real
shop with checkout.

## Status — built 22 Aug 2026, not launched

§§3–9 and §12 are **implemented**: the shared price module, both configurator pages,
the size guide, ready-made listing, cart, Stripe Checkout, the webhook, both dashboards,
and the legal pages. §10's required pages exist at `/terms/`, `/returns/` and
`/delivery/`, and the privacy policy covers Stripe.

**Still outstanding**, and all of §1 still gates launch:

- Real prices — everything is a `9999` placeholder and `PRICES_ARE_REAL` is `false`.
- Real tape names and swatch photos; the catalogue in `shared/src/pricing.ts` is invented.
- The trading address (`TRADING_ADDRESS` in `web/src/lib/data.ts`).
- SES production access — without it customers get no order confirmation.
- Stripe account + live keys in SSM; a Managed-mode Turnstile key for checkout.
- `cdk deploy` for the two new tables, the media bucket and the Stripe SSM params.
- §11 (removing the waiver's WhatsApp question) — untouched, unrelated to the shop.

Two things in this document turned out to be **wrong** and have been corrected below:
the Stripe payout fee (§14) and the number of `shopCategories` to delete (§4).

Where the build deviates from the plan, and why:

- **One shared workspace instead of two copies of the price table** (§3). `@flowsha/shared`
  is imported by both `web` and `lambda`, so there is nothing to drift and no check script.
- **No Stripe SDK** (§9). The REST API over `fetch` avoids ~1 MB of cold-start weight.
- **Stripe collects the delivery address and charges postage** (§8), so there is no custom
  delivery step to build.
- **The order id is our own uuid**, passed to Stripe as metadata, rather than the session
  id — the reservation has to be written before a session exists.
- **Reservation expiry is in the write condition, not TTL** (§9), so correctness never
  depends on a sweeper having run.
- **Skeletons instead of spinners** for anything whose shape is known.

## Decisions already made

| Decision           | Choice                                              | Why                                                                                                                                 |
| ------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Payments           | **Hosted Stripe Checkout** (redirect)               | Same fees as embedded (1.5% + 20p UK card), fraction of the code, Stripe owns PCI/SCA/wallets and collects the delivery address     |
| PayPal             | **Off at launch**, dashboard toggle                 | Costs ~4.0% via Stripe vs 1.9% for cards. Enable later if conversion justifies it — it's a toggle, not a rebuild                    |
| Ready-made stock   | Static shell + **live fetch** from Lambda           | SEO value sits in the two stable custom-product pages; one-off hoops churn too fast to be worth indexing, and accuracy matters more |
| Custom hoop prices | **Price table with placeholders**                   | Real numbers not decided yet — see [launch blockers](#14-launch-blockers)                                                           |
| Shipping           | **UK only** — flat rate + free local collection     | No customs, no IOSS, no international VAT                                                                                           |
| Business           | **Sole trader, not VAT registered**                 | Determines legal disclosures; **no VAT shown anywhere**                                                                             |
| Overselling        | **Reserve on checkout**, release after ~30 min      | One-off hoops must not sell twice. DynamoDB conditional write + TTL                                                                 |
| Photo uploads      | Browser resize → presigned S3 → existing CloudFront | No image Lambda, no raw originals in S3, stays ~£0                                                                                  |
| Bot protection     | Visible Turnstile checkbox **on checkout only**     | Contact/feedback/waiver keep the frictionless invisible check                                                                       |

Running cost estimate at ~15 orders/month, £45 average: **~£15/month** in Stripe
fees, plus roughly £0 AWS (new tables and routes stay inside free tier).

---

## 1. Assets & information needed from Osha

These gate the build. Everything else can start without them.

- [x] **Logo files** — received as SVG (`brand/logo.svg`, plus a PNG). No separate
      horizontal lockup or standalone mark was supplied, so both were derived from the
      artwork instead: the wordmark sits beside the figure in `<Logo>`, and the favicon
      uses the spiral sun extracted from it. See [§2](#2-new-logo-rollout--done-except-the-two-items-below).
- [ ] **Price list** — see [§3](#3-pricing-model) for the shape needed.
- [ ] **Shiny tape list** — every tape name/colour available, plus a swatch photo
      of each (flat, even lighting, consistent crop).
- [ ] **Gaffer tape list** — same, for Simple Spiral.
- [ ] **Grip tape options** — is the All Shiny inside-edge grip a single option, or
      a choice of colours? (Spec is ambiguous.)
- [ ] **Product photos** per custom product: example finished hoops, close-ups of
      the join/rivets, close-up of taping detail, all-tapes-available shot.
- [ ] **Postage rates** — flat UK rate; possibly a second rate for fixed hoops,
      which are far more awkward to post than collapsible ones.
- [ ] **Lead time** for custom hoops (must be stated pre-contract).
- [ ] **Business trading address** — legally required on the site (see [§10](#10-legal--compliance-uk)).
- [ ] **Stripe account** created and activated, bank account connected.

---

## 2. New logo rollout — **done**, except the two items below

The real mark landed: a green dancing figure with an orange hoop and a spiral sun.
Source of truth is `brand/logo.svg`; every derived asset comes out of
`npm run prep-brand` (`scripts/prep-brand.mjs`), so nothing here is hand-maintained.

- [x] `LogoMark` rewritten. The logo is two-colour, so the `currentColor` trick is gone —
      instead **two static SVG colourways** ship in `web/public/brand/` and `tone` picks
      between them. Not cosmetic: the green figure is invisible on the `forest-dark`
      canvas, so dark backgrounds get the cream figure with the orange hoop.
      Static files rather than inline JSX because the artwork is 21 kB of path data, and
      inlining it in both nav and footer would add ~20 kB gzip to every page's HTML.
- [x] Hover animation replaced. `rotate-180` just turned the dancer upside down; it's now
      a lean into the spin (`-rotate-6` + `scale-105`).
- [x] Favicon `web/src/app/icon.svg` — **the spiral sun alone**, extracted from the
      artwork. The full figure is unreadable below ~44px; the sun is crisp at 16px.
- [x] Apple touch icon `web/public/brand/apple-touch-icon.png` — 180×180, cream sun on
      forest-dark. Deliberately not `app/apple-icon.png`: that convention makes
      next-image-export-optimizer emit eight useless WEBP variants into `web/public/`, so
      it is declared explicitly in `layout.tsx` metadata instead (alongside the favicon —
      setting `icons` at all disables Next's file-convention detection).
- [x] Logo added to the customer auto-reply in `lambda/src/lib/ses.ts`, as a hosted PNG at
      an absolute HTTPS URL (`/brand/flowsha-logo-email.png`) since email clients won't
      render SVG.
- [x] Checked at small sizes. Nav uses `h-12` and the footer `h-14`; below ~44px the
      figure's detail collapses, which is exactly why the favicon is the sun instead.
- [ ] Regenerate the OG share image `web/public/images/og/flowsha-og.jpg` — still the
      original plain photo, no logo or wordmark on it.
- [ ] Upload to the Stripe dashboard for Checkout branding, and set the brand
      colours so the payment page doesn't look like a different company.

### Palette re-derived from the logo

`mustard` was the site's dominant accent (~100 usages) and the logo has no yellow at all,
so orange took over. Because the canvas is dark and cream-on-orange is weak, one orange
couldn't do every job — there are now three steps, documented in `web/tailwind.config.ts`
and in [CLAUDE.md](../CLAUDE.md#design-system). Picking the wrong one is a contrast bug.
This also fixed pre-existing failures: `bg-terracotta` + `text-cream` (the primary CTA and
every submit button) was 2.85:1, and small orange error text on the dark canvas was 3.5:1.

`mustard` is still defined, but only so the internal `/styles` prototype gallery keeps
rendering. Don't reintroduce it in live components.

---

## 3. Pricing model

Prices are undecided, so build the machinery with obvious placeholders.

- [ ] Define a typed price table in `web/src/lib/data.ts`:
      base price per hoop size, plus modifiers for tubing diameter and
      fixed/collapsible. All values in **pence** (integers — never floats for money).
- [ ] **Duplicate the same table server-side** and recompute the total in the
      Lambda. The browser's number is display-only. Never create a Stripe session
      from a client-supplied price — that's the single most common way small shops
      get robbed.
- [ ] Use placeholder values that are obviously fake (e.g. `9999`) so a
      half-finished price table can't be mistaken for real pricing.
- [ ] Single source of truth for the table — either a shared module both
      workspaces import, or a generated file with a check that they match.
      Two hand-maintained copies will drift.
- [ ] Decide: full payment up front, or deposit + balance on completion? Full
      payment is much simpler and is assumed throughout this plan.

---

## 4. Content & data model restructure

- [x] **Deleted `shopCategories`** from `web/src/lib/data.ts` and its use in
      `web/src/app/shop/page.tsx`. Note there were **seven** entries, not the six
      listed here — the seventh was **Re-taping**, a real service, which now lives on
      the `/shop/` hub as an enquiry-only card (`shopServices`). Accessories was
      dropped. Kids' Hoops was dropped deliberately and permanently — see §10.
- [ ] New types: `CustomProduct`, `ReadyMadeHoop`, `TapeOption`, `SizeOption`,
      `TubingOption`, `JointOption`.
- [ ] **Sizes**: 24″/61cm → 38″/96.5cm in 1″ steps (15 options). Show both inches
      and cm in the label, as the spec does.
- [ ] **Tubing**: `16mm × 12mm (5/8″) — skinny` and `19mm × 16mm (3/4″) — regular`.
- [ ] **Joint**: `fixed` (two rivets) or `collapsible` — collapsible only offered
      at 30″ and above.
- [ ] ⚠️ **Ambiguity to resolve**: the spec says collapsible is available "only if
      30inch or bigger" but that it coils _fully_ only "if bigger than
      30inches". So is a 30″ hoop partial-coil-only, with full coil from 31″? Or
      is 30″ itself full-coil? Needs confirming before the conditional logic is
      written — it's an off-by-one that would show customers the wrong thing.
- [ ] **Simple Spiral**: shiny tape + gaffer tape, both required.
- [ ] **All Shiny**: shiny tape required; inside-edge grip tape optional.
- [ ] Product copy — use Osha's descriptions from the spec verbatim.
- [ ] Size guide content, with the anchor link the spec asks for.

---

## 5. Custom product pages (static, SEO-critical)

These are the pages that need to rank. Fully static, hand-authored, no runtime
data.

- [ ] `/shop/` becomes a hub: intro, links to the two custom products, link to
      ready-made, size guide.
- [ ] `/shop/simple-spiral/` — new static page.
- [ ] `/shop/all-shiny/` — new static page.
- [ ] `/shop/size-guide/` — own page (better for SEO and linkable from the
      configurator) rather than a section.
- [ ] **Configurator component** (`'use client'`):
  - size select, showing inches and cm
  - tubing select
  - tape selects, with visible swatches — a dropdown of colour _names_ is a poor
    experience when buying something decorative
  - fixed/collapsible, conditionally rendered by size, with an explanation of
    why it disappears below 30″ rather than silently vanishing
  - live running total
  - validation before add-to-cart
  - accessible: real `<label>`s, keyboard operable, price changes announced to
    screen readers via a live region
- [ ] Photo gallery per product: all available tapes, example hoops, close-ups.
      Reuse the existing `Gallery` / `DragScroll` components.
- [ ] `Product` JSON-LD with `offers` (`priceCurrency: GBP`, `availability`,
      `priceValidUntil`), `shippingDetails` and `hasMerchantReturnPolicy`.
      Google flags product markup missing return/shipping data.
- [ ] `BreadcrumbList` JSON-LD via the existing `breadcrumbJsonLd` helper.
- [ ] Unique `metadata` per page via `pageMetadata()`.
- [ ] Add all new routes to `web/src/app/sitemap.ts` and bump `lastModified`.

---

## 6. Ready-made hoops (dashboard-managed)

- [ ] `/shop/ready-made/` — static shell that fetches the live list on mount.
- [ ] Product cards: photos, size, tubing, tapes, price, availability badge.
- [ ] States: available / reserved / sold, plus loading (reuse `Spinner`) and a
      genuine empty state ("no ready-made hoops right now — commission one").
- [ ] Detail view per hoop (modal or client-side route) with the full photo set.
- [ ] Make sure a sold hoop can't be added to the cart from a stale page — the
      server must reject it too.
- [ ] `ItemList` JSON-LD is safe on the hub, but **don't** emit `Product` markup
      for items that are client-fetched — Google won't see it and it risks a
      structured-data mismatch flag.

---

## 7. Dashboard: products & orders

- [ ] `/dashboard/shop/` — manage ready-made hoops:
  - create / edit / archive (soft delete — never hard-delete a hoop that has an
    order attached)
  - photo upload: multiple images, reorder, set primary
  - **alt text field per photo** — required for accessibility and SEO; make it
    mandatory in the form rather than optional-and-always-skipped
  - mark sold manually, for hoops sold in person at a class
- [ ] `/dashboard/orders/` — order list with search/filter, reusing the existing
      `Filters` component and infinite-scroll pattern from `FeedbackDashboard`.
- [ ] Order detail: customer, delivery address, configured options, amount paid,
      Stripe payment link, status.
- [ ] Status transitions: `paid → in progress → dispatched`, with an optional
      tracking number that triggers a dispatch email.
- [ ] CSV export, matching the existing dashboard convention.
- [ ] Add both pages to `DashboardShell` nav.
- [ ] Photo upload flow: resize in-browser via canvas to ~1600px WebP, request a
      presigned PUT from the Lambda (Clerk-authenticated), upload direct to S3.
      Enforce a size cap **server-side** in the presigned URL conditions, not
      just in the browser.

---

## 8. Cart & checkout

- [ ] Cart state in a client context, persisted to `localStorage`.
      Line item = either a configured custom hoop (product + options) or a
      ready-made hoop id.
- [ ] Cart drawer or `/shop/cart/` page: line items, options summary, remove,
      subtotal.
- [ ] Delivery step: flat-rate UK postage **or** free Southampton collection.
- [ ] **Pre-contract information shown immediately before the pay button** —
      total price including delivery, main characteristics, lead time, and the
      cancellation right. This is a legal requirement, not a nicety
      (see [§10](#10-legal--compliance-uk)).
- [ ] Terms acceptance checkbox.
- [ ] Visible Turnstile checkbox (managed mode) on this step only.
- [ ] `POST /checkout` → recompute price server-side → reserve any ready-made
      items → create Stripe Checkout session → return the URL.
- [ ] Return pages: `/shop/thank-you/` (noindex) and cancel back to the cart with
      the cart intact.
- [ ] Cart icon with item count in `Nav`.

---

## 9. Lambda & infrastructure

New routes, following the existing route-table shape in `lambda/src/handler.ts`:

- [ ] `GET /products` — public, live ready-made list.
- [ ] `POST /checkout` — public; validates, reprices, reserves, creates session.
- [ ] `POST /stripe-webhook` — Stripe → us. ⚠️ Needs the **raw** request body for
      signature verification, and Lambda Function URLs may base64-encode it.
      Verify before parsing, and don't let the shared JSON body parser touch it.
      **Must be idempotent** — Stripe retries, and a duplicated order or double
      "sold" write is the failure mode here.
- [ ] `POST /uploads` — Clerk-authenticated, returns a presigned PUT.
- [ ] `GET/POST/PATCH /admin/products`, `GET/PATCH /admin/orders` —
      Clerk-authenticated, reusing `verifySession` from `lambda/src/lib/clerk.ts`.
- [ ] Zod schemas for all new payloads in `lambda/src/lib/validation.ts`.
- [ ] Emails in `lambda/src/lib/ses.ts`: order confirmation to the customer
      (legally required, see [§10](#10-legal--compliance-uk)), order notification
      to Osha, dispatch notification.
- [ ] Reservation expiry via DynamoDB TTL, plus a guard so an expired-but-not-yet-
      swept reservation can still be taken (TTL deletion is not prompt — AWS
      allows up to 48 hours, so never rely on it for correctness).

CDK changes in `infrastructure/lib/flowsha-stack.ts`:

- [ ] `ProductsTable` and `OrdersTable` (follow the existing feedback/waiver
      table pattern).
- [ ] Media S3 bucket + a `/media/*` behaviour on the existing CloudFront
      distribution, via Origin Access Control like `SiteBucket`.
- [ ] SSM parameters for the Stripe secret key and webhook signing secret,
      mirroring the existing `TURNSTILE_SECRET_PARAM` pattern and its narrow
      `ssm:GetParameter` grant.
- [ ] IAM grants; new `CfnOutput`s for the table and bucket names.
- [ ] Review Lambda memory/timeout — the Stripe SDK is a chunky cold start.
- [ ] ⚠️ **Remember `cdk deploy` before tagging a release** — new tables and
      buckets don't come from the GitHub Actions deploy, same trap as the
      feedback and waiver tables.

---

## 10. Legal & compliance (UK)

Assumes **sole trader, not VAT registered**, selling to consumers in the UK.
None of this is legal advice — worth a Trading Standards check via
[Business Companion](https://www.businesscompanion.info/) before launch.

### ⚠️ The important finding: the bespoke exemption probably does not apply

The Consumer Contracts Regulations 2013 exempt goods "made to the customer's
specification or personalised" from the 14-day right to cancel — **but that
exemption explicitly does not cover items created by combining standard stock
items.** A hoop assembled from dropdown menus of standard sizes, standard tubing
and standard tapes looks a lot like combining stock items, not personalisation.

- [ ] **Assume the 14-day cancellation right applies to everything**, including
      configured hoops. Trying to exclude it and being wrong is expensive: the
      cancellation window stretches to **up to 12 months**, and you lose the
      right to deduct for diminished value. If Osha wants to rely on the
      exemption, get that confirmed by Trading Standards first, in writing.

### Required pages

- [ ] **Terms & Conditions** — contract formation, pricing, lead times, delivery,
      cancellation, liability, governing law.
- [ ] **Returns & Cancellations** — 14-day right starting the day after delivery;
      refunds within 14 days; who pays return postage (**if you don't state it,
      you pay it**); include a model cancellation form, while making clear any
      clear statement will do.
- [ ] **Delivery policy** — UK only, rates, dispatch times, collection option.
- [ ] **Trader identity** — trading name, a geographic postal address and an
      email address, all publicly visible. An email address alone is not enough.
- [ ] Update **Privacy Policy** (`web/src/app/privacy/page.tsx`) — Stripe as a
      processor, what order data is stored and for how long, lawful basis. Note
      the existing page already covers Turnstile, so follow that structure.
- [ ] Footer links to all of the above; add to `sitemap.ts` at low priority
      alongside `/privacy/` (the existing `lowPriorityRoutes` set).

### At checkout / in code

- [ ] Total price **inclusive of delivery** shown before the pay button.
- [ ] Cancellation right, lead time and main characteristics shown prominently
      immediately before ordering — the regs single these out for prominence.
- [ ] **Order confirmation email on a durable medium** — legally required.
      ⚠️ This depends on **SES production access**, still outstanding
      (see [DEPLOYMENT.md](../DEPLOYMENT.md)). Until granted, emails only reach
      verified addresses, so customers would get nothing. **Hard launch blocker.**
- [ ] **No VAT anywhere** — not in prices, not on invoices, no VAT number.
      Showing VAT while unregistered is an offence. Prices are simply final.
- [ ] Consumer Rights Act 2015: goods must be as described and of satisfactory
      quality; buyers get a 30-day short-term right to reject. Reflect in T&Cs.
- [ ] Cookie/consent position for Stripe Checkout and Turnstile — check whether
      the current approach still holds once a payment flow exists.

### ⚠️ Do not market hoops to children

The Toys (Safety) Regulations 2011 apply to anything "designed or intended
(whether or not exclusively) for use in play by children under 14". If any hoop
is marketed at children, Osha becomes a toy manufacturer: UKCA marking, EN 71
safety testing, a technical file and Declaration of Conformity retained for
**10 years**, and traceability labelling.

- [ ] Dropping "Kids' Hoops" from the catalogue conveniently avoids all of this.
      Keep it that way — no child-facing copy, imagery or size recommendations in
      the shop, unless Osha deliberately takes on that compliance burden.
- [ ] General Product Safety Regulations 2005 still apply (safe product, adequate
      warnings/instructions). A short care-and-safety note with each hoop is cheap
      insurance.
- [ ] Not code, but worth raising: public liability / product liability insurance.

---

## 11. Remove the WhatsApp question from the waiver

It duplicates the feedback form, which is now where it belongs. Small but touches
six files — the feedback form's own `groupChat` must be **left alone**.

- [ ] `web/src/components/WaiverForm.tsx` — remove the `YesNo` (~line 356), the
      `groupChat` state type (line 54), the initial value (line 74) and the
      summary line (line 569).
- [ ] `lambda/src/lib/validation.ts` — remove `groupChat` from `waiverSchema`
      (line 125). Leave the `feedbackSchema` one (line 59).
- [ ] `lambda/src/lib/ses.ts` — remove the waiver email rows (lines 244, 288).
- [ ] `web/src/components/dashboard/WaiverDashboard.tsx` — remove the type field
      (line 25), filter (line 107), stat (line 137), detail field (line 306) and
      CSV column (line 335).
- [ ] **Bump `WAIVER_VERSION`** in _both_ `web/src/lib/data.ts` (line 480) and
      `lambda/src/lib/validation.ts` (line 85) — they must stay in sync.
- [ ] Existing stored waivers keep the field. The dashboard already renders
      defensively; confirm removing the column doesn't break historic rows.

---

## 12. Bot protection

- [ ] Add Turnstile in **managed (visible checkbox)** mode to the checkout step.
- [ ] Leave contact, feedback and waiver on invisible mode.
- [ ] ♻️ The Turnstile render logic is currently copy-pasted across
      `ContactForm`, `FeedbackForm` and `WaiverForm`. Adding a fourth copy with a
      _different mode_ is the point where this should become a shared
      `useTurnstile(mode)` hook.
- [ ] Consider per-IP rate limiting on `/checkout` later — card-testing attacks
      specifically target checkout endpoints. Not needed at launch.

---

## 13. Testing & QA

- [ ] Full Stripe **test mode** run-through end to end.
- [ ] Test cards: success, 3DS/SCA challenge, decline, insufficient funds.
- [ ] Webhook tested locally with the Stripe CLI, including a **replayed** event
      to prove idempotency.
- [ ] **Price tampering test** — tamper with the client payload and confirm the
      server rejects it rather than charging the tampered amount.
- [ ] **Double-buy race test** — two concurrent checkouts for the same ready-made
      hoop; exactly one must win.
- [ ] Abandoned checkout releases the reservation.
- [ ] Mobile checkout on a real phone, including a wallet payment.
- [ ] Accessibility pass on the configurator: keyboard only, screen reader, focus
      order, price-change announcements.
- [ ] Lighthouse on the new pages — don't regress the existing scores.
- [ ] Rich Results Test on the `Product` markup.
- [ ] One real live order, then refund it, before announcing anything.

---

## 14. Launch blockers

Nothing goes live until all of these are true:

- [ ] Real prices in place (no placeholders anywhere).
- [ ] **SES production access granted** — without it customers get no order
      confirmation, which is a legal requirement, not just poor service.
- [ ] Stripe account activated, live keys in SSM, bank account connected.
- [x] ~~Payout schedule set to weekly, not daily — payouts cost £0.50 each.~~
      **This was wrong.** Standard UK Stripe payouts are free on the default rolling
      schedule; only _Instant_ Payouts cost anything (1%, min £1.00). Nothing to do.
- [ ] Business trading address published on the site.
- [ ] Legal pages written and ideally reviewed by someone qualified.
- [ ] Postage rates confirmed and configured.
- [ ] Tape lists and swatch photos in place.
- [ ] Logo rolled out everywhere in [§2](#2-new-logo-rollout).
- [ ] `cdk deploy` run for the new tables, bucket and SSM params.
- [ ] Test order placed and refunded successfully.
- [ ] `CLAUDE.md` and `DEPLOYMENT.md` updated — the "Future: hoop ordering"
      section becomes current, and the deploy runbook needs the new
      resources and Stripe secrets.

---

## Still open

- Collapsible availability at exactly 30″ — see [§4](#4-content--data-model-restructure).
- Is All Shiny's grip tape one option or a choice of colours?
- Accessories: dropped, or parked for a later phase?
- Deposit or full payment up front?
- Where are the logo files, and in what format?
