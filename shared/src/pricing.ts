import type {
  CustomProduct,
  DeliveryOption,
  JointOption,
  SizeOption,
  TapeOption,
  TubingOption,
} from './types';

// ⚠️ EVERY PRICE IN THIS FILE IS A PLACEHOLDER. ⚠️
//
// Osha hasn't set prices yet (see SHOP-PLAN §1). Placeholders are deliberately
// absurd — £99.99 base, £9.99 modifiers — so a half-finished table can never be
// mistaken for real pricing, and so a stray one is obvious on the page.
//
// All money is INTEGER PENCE. Never floats: 0.1 + 0.2 !== 0.3, and a rounding
// error here is a mispriced order.
export const PLACEHOLDER_BASE_PENCE = 9999;
export const PLACEHOLDER_MODIFIER_PENCE = 999;

/** Flips to true once real prices land; the UI shows a "prices coming soon" notice while false. */
export const PRICES_ARE_REAL = false;

export const CURRENCY = 'gbp';

// --- Sizes: 24″ → 38″ in 1″ steps (15 options) -------------------------------

const INCHES_TO_CM = 2.54;

function sizeOption(inches: number): SizeOption {
  const cm = Math.round(inches * INCHES_TO_CM * 10) / 10;
  // Drop a trailing `.0` so 24″ reads `61cm`, not `61.0cm`.
  const cmLabel = Number.isInteger(cm) ? String(cm) : cm.toFixed(1);
  return {
    inches,
    cm,
    label: `${inches}″ / ${cmLabel}cm`,
    basePence: PLACEHOLDER_BASE_PENCE,
  };
}

export const SIZES: SizeOption[] = Array.from({ length: 15 }, (_, i) => sizeOption(24 + i));

export const MIN_SIZE_INCHES = 24;
export const MAX_SIZE_INCHES = 38;

// --- Tubing ------------------------------------------------------------------

export const TUBING: TubingOption[] = [
  {
    id: 'skinny',
    label: '16mm × 12mm (5/8″) — skinny',
    description: 'Lighter and faster. Better once you have the basics and want quicker tricks.',
    surchargePence: 0,
  },
  {
    id: 'regular',
    label: '19mm × 16mm (3/4″) — regular',
    description: 'Heavier and slower to spin, so it stays up more easily. A good place to start.',
    surchargePence: PLACEHOLDER_MODIFIER_PENCE,
  },
];

// --- Joint -------------------------------------------------------------------

// SHOP-PLAN §4 flags an off-by-one in Osha's spec: collapsible is offered "only if
// 30inch or bigger", but coils *fully* only "if bigger than 30inches". Until she
// confirms, we offer collapsible from 30″ and treat 30″ itself as partial-coil.
// Both rules live behind the predicates below, so resolving it is a one-line change.
export const COLLAPSIBLE_MIN_INCHES = 30;
export const FULL_COIL_MIN_INCHES = 31;

export function isCollapsibleAvailable(inches: number): boolean {
  return inches >= COLLAPSIBLE_MIN_INCHES;
}

export function coilsFully(inches: number): boolean {
  return inches >= FULL_COIL_MIN_INCHES;
}

export const JOINTS: JointOption[] = [
  {
    id: 'fixed',
    label: 'Fixed (two rivets)',
    description: 'One solid circle. Strongest and simplest, but it does not fold down.',
    surchargePence: 0,
  },
  {
    id: 'collapsible',
    label: 'Collapsible',
    description: `Folds down for travel and storage. Only possible from ${COLLAPSIBLE_MIN_INCHES}″ upwards — smaller hoops have too tight a curve.`,
    surchargePence: PLACEHOLDER_MODIFIER_PENCE,
  },
];

// --- Tapes -------------------------------------------------------------------

// ⚠️ Placeholder catalogue. Osha owes the real tape names and swatch photos
// (SHOP-PLAN §1); `swatch` is an approximate CSS colour until those land.
export const TAPES: TapeOption[] = [
  { id: 'shiny-gold', name: 'Gold', kind: 'shiny', swatch: '#d4af37', surchargePence: 0 },
  { id: 'shiny-silver', name: 'Silver', kind: 'shiny', swatch: '#c0c0c0', surchargePence: 0 },
  { id: 'shiny-copper', name: 'Copper', kind: 'shiny', swatch: '#b87333', surchargePence: 0 },
  { id: 'shiny-teal', name: 'Teal', kind: 'shiny', swatch: '#008080', surchargePence: 0 },
  { id: 'shiny-magenta', name: 'Magenta', kind: 'shiny', swatch: '#c2185b', surchargePence: 0 },
  { id: 'gaffer-black', name: 'Black', kind: 'gaffer', swatch: '#1a1a1a', surchargePence: 0 },
  { id: 'gaffer-white', name: 'White', kind: 'gaffer', swatch: '#f2f2f2', surchargePence: 0 },
  {
    id: 'gaffer-forest',
    name: 'Forest green',
    kind: 'gaffer',
    swatch: '#2b402e',
    surchargePence: 0,
  },
  { id: 'grip-clear', name: 'Clear grip', kind: 'grip', swatch: '#e8e8e8', surchargePence: 0 },
  { id: 'grip-black', name: 'Black grip', kind: 'grip', swatch: '#2a2a2a', surchargePence: 0 },
];

export function tapesOfKind(kind: TapeOption['kind']): TapeOption[] {
  return TAPES.filter((t) => t.kind === kind);
}

export function findTape(id: string): TapeOption | undefined {
  return TAPES.find((t) => t.id === id);
}

export function findSize(inches: number): SizeOption | undefined {
  return SIZES.find((s) => s.inches === inches);
}

export function findTubing(id: string): TubingOption | undefined {
  return TUBING.find((t) => t.id === id);
}

export function findJoint(id: string): JointOption | undefined {
  return JOINTS.find((j) => j.id === id);
}

// --- Products ----------------------------------------------------------------

export const CUSTOM_PRODUCTS: CustomProduct[] = [
  {
    id: 'simple-spiral',
    slug: 'simple-spiral',
    name: 'Simple Spiral',
    tagline: 'Two tapes, spiralled — clean, bold and easy to track while you learn.',
    description: [
      'A spiral of shiny tape over gaffer tape. The contrast makes the hoop easy to follow as it moves, which helps enormously when you are learning a new trick.',
      'Choose your shiny tape and your gaffer tape, and I will wind them together by hand.',
    ],
    tapeSlots: [
      {
        kind: 'shiny',
        label: 'Shiny tape',
        help: 'The bright spiral that catches the light.',
        required: true,
      },
      {
        kind: 'gaffer',
        label: 'Gaffer tape',
        help: 'The base colour the spiral sits against.',
        required: true,
      },
    ],
  },
  {
    id: 'all-shiny',
    slug: 'all-shiny',
    name: 'All Shiny',
    tagline: 'Covered end to end in shiny tape. The one that really catches the light.',
    description: [
      'Wrapped completely in shiny tape, so the whole hoop glints as it spins. It looks spectacular in sunlight and under stage lighting alike.',
      'Add grip tape to the inside edge if you want a little more purchase for on-body work.',
    ],
    tapeSlots: [
      {
        kind: 'shiny',
        label: 'Shiny tape',
        help: 'Covers the whole hoop.',
        required: true,
      },
      {
        kind: 'grip',
        label: 'Inside-edge grip tape',
        help: 'Optional. Adds grip for waist and chest work.',
        required: false,
      },
    ],
  },
];

export function findProduct(id: string): CustomProduct | undefined {
  return CUSTOM_PRODUCTS.find((p) => p.id === id);
}

// --- Delivery ----------------------------------------------------------------

// UK only — no customs, no IOSS, no international VAT (SHOP-PLAN decisions table).
// ⚠️ Postage rates are placeholders; Osha owes the real ones, possibly with a
// second higher rate for fixed hoops, which are far more awkward to post.
export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'collection',
    label: 'Collect in Southampton',
    description: 'Free. I will message you to arrange a time once your hoop is ready.',
    pricePence: 0,
  },
  {
    id: 'uk-standard',
    label: 'UK delivery',
    description: 'Tracked, UK mainland only.',
    pricePence: PLACEHOLDER_MODIFIER_PENCE,
  },
];

export function findDelivery(id: string): DeliveryOption | undefined {
  return DELIVERY_OPTIONS.find((d) => d.id === id);
}

// --- Formatting --------------------------------------------------------------

/** Pence → `£99.99`. Used by the UI, the emails and the dashboard alike. */
export function formatPence(pence: number): string {
  const sign = pence < 0 ? '-' : '';
  const abs = Math.abs(Math.round(pence));
  return `${sign}£${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}
