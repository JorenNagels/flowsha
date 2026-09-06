// Shared registry + toolbar for the /1…/50 internal trials. Lives in its own file so the
// server-rendered trials and the 'use client' ones can both import it without a cycle.
//
// Nothing here is ever deleted — the whole set is kept so the full history of options can
// be walked through in one sitting. New ideas get appended with the next free number.

import Link from 'next/link';

export type TrialMeta = {
  id: string;
  name: string;
  blurb: string;
  /** What it would cost to build for real, stated plainly. */
  cost: string;
  /** Groups the toolbar into bands so 24 options stay navigable. */
  kind: 'colour' | 'cinematic' | 'scroll' | 'palette' | 'art' | 'full' | 'archive';
};

export const TRIAL_META: TrialMeta[] = [
  {
    id: '1',
    name: 'Aubergine chrome',
    blurb:
      'Nav and footer alone go deep aubergine; body and hero stay forest green. The full logo untouched at 3.2:1. Green and orange against purple is a complementary pairing, so the figure reads warmer and louder than it ever did on green.',
    cost: 'Two background values plus one palette token. Nothing else on the site moves.',
    kind: 'colour',
  },
  {
    id: '2',
    name: 'Purple canvas',
    blurb:
      'Commit to it — the whole page becomes deep violet and forest green stops being the background, becoming an accent instead. The logo is then the only green thing on the page, which is exactly why it stands out.',
    cost: 'A real palette change: every bg-forest-dark and bg-forest/40 across all pages, forms, dashboard and 404. Big, but a token find-and-replace, not a re-layout.',
    kind: 'colour',
  },
  {
    id: '3',
    name: 'Oversized breakout',
    blurb:
      'Keep the green chrome exactly as it is and solve it with scale rather than colour. The figure runs at roughly double size and breaks out of the header down into the hero, so it reads as an illustration instead of an icon.',
    cost: 'Nav and Footer, plus a taller header and an overflow fix. Zero colour changes — the palette you have today survives untouched.',
    kind: 'colour',
  },
  {
    id: '4',
    name: 'Espresso chrome',
    blurb:
      'Warm dark brown rather than purple — a deeper relative of the clay already in the palette. 3.1:1, and it makes the orange hoop glow. Stays in the earthy register the brand brief asks for.',
    cost: 'Two background values plus one palette token — the same size of change as option 1.',
    kind: 'colour',
  },
  {
    id: '5',
    name: 'Gradient chrome',
    blurb:
      'The header runs left to right from aubergine into the current forest green. The logo sits on the dark purple end where it has contrast; the nav links stay on familiar green.',
    cost: 'Nav and Footer only. The right-hand end has to stay dark enough for the nav links, so the gradient cannot travel far.',
    kind: 'colour',
  },
  {
    id: '6',
    name: 'Purple canvas + breakout',
    blurb:
      'The two strongest colour ideas together: a violet canvas so the logo is the only green on the page, and the figure at double size breaking out of the header.',
    cost: 'The palette change from option 2 plus the header work from option 3 — the most work of the six colour options.',
    kind: 'colour',
  },
  {
    id: '7',
    name: 'Logo flight intro',
    blurb:
      'Apple-style entrance. The page opens on a near-black curtain with the logo huge and centred; it holds a beat, then flies up-left, shrinking into its nav position as the hero fades in beneath. One-shot on load, and it solves contrast by simply showing the logo at 40vh before it ever has to be small.',
    cost: 'A client component plus a session flag so it only plays once per visit, not on every navigation. Pure CSS keyframes, no library. Must honour prefers-reduced-motion, and the LCP element has to stay the hero text or it hurts the SEO scores.',
    kind: 'cinematic',
  },
  {
    id: '8',
    name: 'Scroll-spun 3D hoops',
    blurb:
      'Real 3D. Orange hoops orbit the dancer in perspective, and their rotation is driven by scroll position, so the figure appears to be hooping as you move down the page. The logo stays flat artwork; the motion is CSS transforms around it.',
    cost: 'A client component with a scroll listener (rAF-throttled) writing one CSS variable. No 3D library. The rings are CSS ellipses, so nothing new to draw or export.',
    kind: 'cinematic',
  },
  {
    id: '9',
    name: 'Cinematic panels',
    blurb:
      'A full homepage rethink rather than a chrome fix. Apple product-page structure: full-viewport scroll-snapped panels, one statement each, huge type, full-bleed photography. The logo opens the first panel at a size where contrast is a non-issue.',
    cost: 'A genuine redesign of the homepage — new sections, new copy rhythm, scroll-snap behaviour. The other pages would need to follow or the site feels split in two. Biggest job here by far.',
    kind: 'cinematic',
  },
  {
    id: '10',
    name: 'Pointer-tilt depth',
    blurb:
      'The logo sits in a layered scene and tilts in 3D toward your cursor, lifted off the photo on a soft shadow while the background drifts the opposite way. Tactile and physical — the mark feels like an object rather than a picture.',
    cost: 'A client component with a pointermove listener. Desktop-only flourish: touch devices get the static layered version, which has to look finished on its own.',
    kind: 'cinematic',
  },
  {
    id: '11',
    name: 'Scroll-scrubbed reveal',
    blurb:
      'The flagship Apple move. A tall runway with a pinned viewport: the logo starts at 54vh dead centre and scrubs down to nav size as you scroll, while three text beats cross-fade beneath it and the photo pushes in behind. You control the animation with the scroll wheel — it is a timeline, not a loop.',
    cost: 'One client component. Scroll progress is written to a CSS custom property, so nothing re-renders per frame. The runway is 320vh, which means the homepage gets noticeably longer — worth checking that against how people actually use the site.',
    kind: 'scroll',
  },
  {
    id: '12',
    name: 'Pinned horizontal scroll',
    blurb:
      'Vertical scrolling drives sideways travel. Four full-screen panels — the logo, then each offering — slide past while the viewport stays pinned. The trick Apple uses for product line-ups.',
    cost: 'One client component, same CSS-variable approach. Needs care on mobile and for keyboard users: horizontal panels that only respond to vertical scroll can be awkward to reach, so it needs a fallback to a normal vertical stack on small screens.',
    kind: 'scroll',
  },
  {
    id: '13',
    name: 'Hoop wipe',
    blurb:
      'A hoop opens out from the centre and the photo scene is revealed through it. The orange ring is drawn exactly on the clip edge, so it reads as an actual hoop expanding rather than an abstract circular mask — the brand motif doing the transition.',
    cost: 'One client component. clip-path is GPU-composited so it stays smooth. The most on-brand of the scroll ideas: the transition device is the product.',
    kind: 'scroll',
  },
  {
    id: '14',
    name: 'Stacked sticky cards',
    blurb:
      'Each section deals over the top of the last on rounded shoulders, so the page feels like a deck being laid down. Warm, tactile, and it gives each offering a full screen without the page feeling endless.',
    cost: 'Zero JavaScript — position:sticky and z-index do all of it. Cheapest of the four scroll options by a distance, and the most robust.',
    kind: 'scroll',
  },
  {
    id: '25',
    name: 'Petrol',
    blurb:
      'Dark teal as the main colour. Adjacent to green on the wheel so the site still feels natural and outdoorsy, but far enough round that the figure separates cleanly. 3.2:1.',
    cost: 'A palette swap: forest-dark and forest stop being backgrounds site-wide. Token-level find-and-replace across all pages, forms, dashboard and 404 — no re-layout.',
    kind: 'palette',
  },
  {
    id: '26',
    name: 'Midnight indigo',
    blurb:
      'Cool, night-time and a little theatrical. The warm orange hoop sings hardest against this of any option here — complementary temperature rather than just complementary hue. 3.4:1.',
    cost: 'Same palette swap. Furthest from the "natural/earthy" brand brief of the dark options.',
    kind: 'palette',
  },
  {
    id: '27',
    name: 'Charcoal',
    blurb:
      'Neutral. No hue competes with anything, so the logo supplies the only colour on the page and the photography carries the warmth. The most Apple of the six, and the safest. 3.3:1.',
    cost: 'Same palette swap, and the easiest to get right — a neutral base cannot clash with a photo.',
    kind: 'palette',
  },
  {
    id: '28',
    name: 'Oxblood',
    blurb:
      'Deep burgundy. Warm, rich and theatrical — reads like a venue rather than a studio, which suits the fire and LED performance side of the business. 3.3:1.',
    cost: 'Same palette swap. Watch it against the pink-lit gallery photos, which sit close to this hue.',
    kind: 'palette',
  },
  {
    id: '29',
    name: 'Dark rust',
    blurb:
      "The brand's own orange taken right down to near-black. The page becomes nearly monochrome with the hoop, and the figure's green is the only thing that breaks it — the most tightly branded option of the six. 3.2:1.",
    cost: 'Same palette swap, and no new hue enters the brand at all — it is the existing terracotta at a much lower lightness.',
    kind: 'palette',
  },
  {
    id: '30',
    name: 'Bone (light)',
    blurb:
      'The other direction entirely: a warm off-white canvas, so the figure reads dark-on-light at 4.7:1 instead of light-on-dark. Softer and warmer than the cream already in the palette. Hero keeps a dark scrim so the headline stays legible over the photo.',
    cost: 'The largest of the six — every text colour flips as well as every background, across all pages, forms, the dashboard and the 404. Note the orange hoop drops to 2.7:1 on a light canvas; fine for a logotype, which is exempt, but it is quieter than on dark.',
    kind: 'palette',
  },
  {
    id: '31',
    name: 'Gig poster',
    blurb:
      'Screen-printed festival flyer. Stacked display type at full width, the logo printed twice with a deliberate registration offset — the two-colour-press misprint. Offerings become a tour-date list with heavy rules.',
    cost: 'A homepage rebuild. Type-led, so it needs real copy decisions rather than just layout. Cheap technically, no images beyond the logo.',
    kind: 'art',
  },
  {
    id: '32',
    name: 'Zine collage',
    blurb:
      'Cut-and-paste flow-arts zine: photos on white borders, tape strips, everything a degree or two off square. This is what the hooping scene actually looks like — handmade, DIY, unpolished on purpose.',
    cost: 'Rotations and overlaps fight responsive layout hard; small screens need a separate stacked arrangement, not a squeeze. The most work of the ten to make robust.',
    kind: 'art',
  },
  {
    id: '33',
    name: 'Kinetic ribbons',
    blurb:
      'The page is built from bands of type moving at three different speeds, with the logo held still in the middle of it — the hooper inside the hoop. Nothing on a hooping site should sit still.',
    cost: 'Pure CSS keyframes, no JS. Honours prefers-reduced-motion. Watch it does not become the whole personality: it needs quiet sections beneath to breathe.',
    kind: 'art',
  },
  {
    id: '34',
    name: 'Light trails',
    blurb:
      'The look of LED hooping photography — long exposure, glowing arcs in the dark, colour trails in orange, teal and violet. Leans straight into the fire-and-LED performance side of the business.',
    cost: 'Gradients and blurred borders, no canvas. Very strong for performance bookings; arguably sells beginner daytime classes less well.',
    kind: 'art',
  },
  {
    id: '35',
    name: 'Gallery',
    blurb:
      'The logo hung as an artwork with a caption plate beneath it, museum-grade restraint, hairline rules, offerings as a numbered exhibit list. Treats Osha as an artist with a body of work rather than a service provider.',
    cost: 'The cheapest of the ten and the most SEO-friendly — mostly semantic type. Risk is coldness: it needs the photography reintroduced somewhere or it reads aloof.',
    kind: 'art',
  },
  {
    id: '36',
    name: 'Orbit',
    blurb:
      'Hoop geometry as the layout system. The logo sits dead centre, rings around it, and the navigation is positioned on the outer ring by angle. The structure of the page IS the product.',
    cost: 'The most conceptually on-brand and the most technically awkward. Radial navigation is hard for keyboard and screen-reader users, and needs a plain linear fallback on mobile — that fallback is the real work.',
    kind: 'art',
  },
  {
    id: '37',
    name: 'Sketchbook',
    blurb:
      "Osha's notebook — hand-drawn wobbly rings in SVG, dashed boxes, things annotated in italic. Warm, human and personal; makes a beginner class feel approachable rather than athletic.",
    cost: 'Low technical cost. The hand-drawn feel needs a consistent hand though — a few real drawn assets from Osha would lift it far past what CSS dashes can fake.',
    kind: 'art',
  },
  {
    id: '38',
    name: 'Brutalist type',
    blurb:
      'Type at maximum, hard grid, no rounding, the logo oversized and deliberately cropped off the right edge. Confident and contemporary — art-school poster rather than small business.',
    cost: 'Cheap and robust; a hard grid is the easiest thing to make responsive. Tone risk: it reads tough, which may be the opposite of what a first-time hooper wants.',
    kind: 'art',
  },
  {
    id: '39',
    name: 'Stage',
    blurb:
      'A dark theatre and one spotlight, with the logo as the performer walking into the beam. Light pool on the floor, long shadow, warm gold. Pure theatre.',
    cost: 'CSS gradients and a clip-path beam. Same caveat as light trails — brilliant for performance enquiries, quieter for daytime classes.',
    kind: 'art',
  },
  {
    id: '40',
    name: 'Programme',
    blurb:
      'The site as a performance programme: a ticket with a real perforated stub, the logo printed on the stub in brand green, details as monospace rows. Collectable, tactile, and it makes booking feel like an event.',
    cost: 'Moderate. The perforation is a repeating radial-gradient, so it costs nothing, but the ticket metaphor has to carry through to the actual booking flow or it is just decoration.',
    kind: 'art',
  },
  {
    id: '41',
    name: 'Editorial magazine',
    blurb:
      'A culture magazine: masthead and issue line, a cover spread, a feature with a real drop cap running Osha’s own words, an index of offerings, a four-up photo essay and a back page. Treats the business as a publication with a point of view.',
    cost: 'Type-led, so mostly semantic HTML — the cheapest of the ten to build and the strongest for SEO. Needs an editor’s eye on copy length; the two-column feature breaks down if paragraphs run uneven.',
    kind: 'full',
  },
  {
    id: '42',
    name: 'Vinyl record',
    blurb:
      'The site as an album. Green sleeve with the logo as cover art, offerings as a numbered tracklist with running times, Osha’s story as liner notes, sleeve-back photo grid, ℘ line in the footer.',
    cost: 'Straightforward build. The metaphor needs holding lightly — “running times” for class lengths works, but push it further and it starts obscuring what you actually sell.',
    kind: 'full',
  },
  {
    id: '43',
    name: 'Botanical field guide',
    blurb:
      'The figure genuinely reads as leaves and stems, so this makes it a herbarium plate: framed specimen, latinate names, collector’s notes, three specimen cards. The most unexpected fit for the artwork of anything here.',
    cost: 'Cheap and highly distinctive. The latin names are a joke that has to land — if Osha finds them twee the whole conceit goes, so it is worth checking with her before building.',
    kind: 'full',
  },
  {
    id: '44',
    name: 'Terminal',
    blurb:
      'Monospace throughout, prompt lines, offerings as an ls listing, the bio as cat about.txt, reviews as a log tail. Deliberately the wrong register for hooping, which is exactly why it sticks.',
    cost: 'Very cheap. Real risk: it speaks to developers, not to someone nervous about their first class. Almost certainly wrong for the actual audience — included because you asked for creative, not safe.',
    kind: 'full',
  },
  {
    id: '45',
    name: 'Risograph duotone',
    blurb:
      'Two inks only — your existing green and orange — overprinting with halftone dots, mix-blend-multiply and a deliberately misregistered logo plate. Indie-press craft, and it introduces no new colours at all.',
    cost: 'Moderate. mix-blend-multiply and halftone gradients need checking on older Safari, and the grain adds no image weight since it is all CSS.',
    kind: 'full',
  },
  {
    id: '46',
    name: 'Neon sign',
    blurb:
      'The wordmark as neon tube on a dark wall, layered glow on the logo, offerings in three different tube colours. The glow does the logo’s contrast work for it — no recolouring needed.',
    cost: 'Cheap — all text-shadow and drop-shadow. Sells fire and LED bookings hardest; a beginner looking for a daytime class may not see themselves in it.',
    kind: 'full',
  },
  {
    id: '47',
    name: 'Tape swatches',
    blurb:
      'Built around the thing Osha actually makes. A swatch wall of hoop tapes as the hero, a spec table beside the logo, materials language throughout. This is the shop’s best argument used as the homepage.',
    cost: 'Cheap, and it doubles as the groundwork for the real shop — the swatch grid is the tape picker the shop plan already needs. Best strategic fit of the ten.',
    kind: 'full',
  },
  {
    id: '48',
    name: 'Storybook',
    blurb:
      'Bright, round and warm: organic blob shapes, chunky buttons with hard shadows, the logo as a character. Aimed squarely at kids’ and absolute-beginner classes.',
    cost: 'Cheap. Tone is the whole question — it makes a first class feel completely unintimidating, but it undersells the professional performance side entirely.',
    kind: 'full',
  },
  {
    id: '49',
    name: 'Blueprint',
    blurb:
      'The hoop as an engineered object: draughting grid, dimension lines through the logo, cyan on navy, a spec table. Makes “handmade” read as “made properly”, which is what the shop actually needs to say.',
    cost: 'Cheap — the grid is two repeating gradients. Cyan is a new brand colour though, so either it joins the palette deliberately or it gets swapped for the existing sage.',
    kind: 'full',
  },
  {
    id: '50',
    name: 'Timeline scrapbook',
    blurb:
      'Osha’s decade of hooping as the spine of the page, with numbered milestones, her real paragraphs and photos pinned slightly askew. Sells the person, which is what actually sells classes.',
    cost: 'Cheap, and the only one of the ten that puts the founder story at the centre rather than the offer. Strongest for trust; needs Osha to be comfortable being the whole homepage.',
    kind: 'full',
  },
  {
    id: '15',
    name: 'Archive · Cream knockout',
    blurb:
      'The industry-standard answer, and the first one rejected: the figure repainted cream for dark backgrounds. Kept for the record because every brand guide recommends it. ALTERS THE ARTWORK.',
    cost: 'Reference only — recolouring is ruled out by the current brief.',
    kind: 'archive',
  },
  {
    id: '16',
    name: 'Archive · Light chrome',
    blurb:
      'Cream nav and sand footer with the logo unframed and full-colour; hero and body stay dark. The logo on the light background it was drawn for.',
    cost: 'Nav, Footer and CtaButton. Sticky nav unchanged.',
    kind: 'archive',
  },
  {
    id: '17',
    name: 'Archive · Cream plate',
    blurb:
      'The logo in a cream rounded square, dark chrome untouched. Smallest possible change — but several published brand guidelines explicitly forbid dropping a logo into an unapproved container, which is what this is.',
    cost: 'Logo component only.',
    kind: 'archive',
  },
  {
    id: '18',
    name: 'Archive · Cream halo',
    blurb:
      'A cream glow bleeding out behind the logo with no hard edge. Unframed in principle, but at real size it reads as a blur or a rendering artefact rather than a deliberate device.',
    cost: 'Logo component only.',
    kind: 'archive',
  },
  {
    id: '19',
    name: 'Archive · Light-first',
    blurb:
      'The whole canvas flipped to cream with forest type and sand cards; only the hero stays a dark photo band. Brightest and airiest version of the site.',
    cost: 'A full redesign — every colour usage across all pages, forms, dashboard and 404.',
    kind: 'archive',
  },
  {
    id: '20',
    name: 'Archive · Fading header',
    blurb:
      'The cream bar gradients away downward so there is no hard line where chrome meets photo. Prettiest of the first round, but a sticky gradient header cannot stay legible once scrolled over body content.',
    cost: 'Needs a scroll listener to snap the nav to solid cream — behaviour the current nav does not have.',
    kind: 'archive',
  },
  {
    id: '21',
    name: 'Archive · Wordmark only',
    blurb:
      'No mark in the chrome at all, just "Flowsha" in Fraunces. Clean and standard practice where a symbol will not reproduce clearly — but the mark disappears from every page header.',
    cost: 'Nav and Footer only.',
    kind: 'archive',
  },
  {
    id: '22',
    name: 'Archive · Sun mark',
    blurb:
      "The artwork's own spiral sun as the chrome mark, at its own orange, nothing recoloured. Already the favicon. Bold at small sizes — but it is not the full logo.",
    cost: 'Nav and Footer only; the sun is already generated by prep-brand.',
    kind: 'archive',
  },
  {
    id: '23',
    name: 'Archive · Near-black chrome',
    blurb:
      'Nav and footer drop to a near-black green, taking the untouched figure from 1.6:1 to 3.3:1. Works, and the direct ancestor of the aubergine and espresso options — just more muted than either.',
    cost: 'Nav and Footer background plus one palette token.',
    kind: 'archive',
  },
  {
    id: '24',
    name: 'Archive · Mono orange',
    blurb:
      "The figure repainted in the logo's own orange rather than white. Reads clearly, but the hoop and body merge into one silhouette and the drawing loses its structure. ALTERS THE ARTWORK.",
    cost: 'Reference only — recolouring is ruled out by the current brief.',
    kind: 'archive',
  },
];

const GROUPS: [TrialMeta['kind'], string][] = [
  ['colour', 'Colour'],
  ['cinematic', 'Motion'],
  ['scroll', 'Scroll'],
  ['palette', 'Main colour'],
  ['art', 'Art direction'],
  ['full', 'Full page'],
  ['archive', 'Archive'],
];

export function Switcher({ current }: { current: string }) {
  const active = TRIAL_META.find((t) => t.id === current);
  return (
    <div className="bg-[#0d0d0d] px-5 py-3 text-cream">
      {GROUPS.map(([kind, label]) => (
        <div key={kind} className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 w-[74px] shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-cream/40">
            {label}
          </span>
          {TRIAL_META.filter((t) => t.kind === kind).map((t) => (
            <Link
              key={t.id}
              href={`/${t.id}/`}
              className={`rounded-full px-2.5 py-1 text-[12.5px] font-semibold transition-colors ${
                t.id === current
                  ? 'bg-terracotta-light text-[#0d0d0d]'
                  : kind === 'archive'
                    ? 'bg-cream/5 text-cream/55 hover:bg-cream/15'
                    : 'bg-cream/10 text-cream/80 hover:bg-cream/20'
              }`}
            >
              {t.id} · {t.name.replace('Archive · ', '')}
            </Link>
          ))}
          {kind === 'colour' && (
            <Link href="/" className="ml-auto text-sm text-cream/50 underline hover:text-cream/80">
              real site →
            </Link>
          )}
        </div>
      ))}
      {active && (
        <>
          <p className="mt-2.5 max-w-5xl text-[13px] leading-relaxed text-cream/70">
            {active.blurb}
          </p>
          <p className="mt-1 max-w-5xl text-[13px] leading-relaxed text-terracotta-light/90">
            <b className="font-bold">Cost to build:</b> {active.cost}
          </p>
        </>
      )}
    </div>
  );
}
