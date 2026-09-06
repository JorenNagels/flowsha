// Domain model for the hoop shop. Imported by BOTH `web` (display) and `lambda`
// (authoritative repricing), so there is exactly one definition of everything.

// --- Options -----------------------------------------------------------------

export type TubingId = 'skinny' | 'regular';
export type JointId = 'fixed' | 'collapsible';
export type TapeKind = 'shiny' | 'gaffer' | 'grip';
export type CustomProductId = 'simple-spiral' | 'all-shiny';

export type SizeOption = {
  inches: number;
  /** Rounded to 1dp, e.g. 96.5. Labels show both units, as Osha's spec does. */
  cm: number;
  /** e.g. `32″ / 81.5cm` */
  label: string;
  basePence: number;
};

export type TubingOption = {
  id: TubingId;
  /** e.g. `19mm × 16mm (3/4″) — regular` */
  label: string;
  description: string;
  surchargePence: number;
};

export type JointOption = {
  id: JointId;
  label: string;
  description: string;
  surchargePence: number;
};

export type TapeOption = {
  id: string;
  name: string;
  kind: TapeKind;
  /** CSS colour for the swatch chip, until real swatch photos arrive. */
  swatch: string;
  /** Swatch photo under /images/shop/tapes/ — optional while photos are outstanding. */
  image?: string;
  surchargePence: number;
};

/** One tape choice a product asks the customer to make. */
export type TapeSlot = {
  kind: TapeKind;
  /** Field label, e.g. `Shiny tape`. */
  label: string;
  help: string;
  required: boolean;
};

// --- Products ----------------------------------------------------------------

export type CustomProduct = {
  id: CustomProductId;
  /** URL segment under /shop/ — routes are trailing-slash (`/shop/all-shiny/`). */
  slug: string;
  name: string;
  tagline: string;
  /** Paragraphs of body copy. Osha's wording, verbatim. */
  description: string[];
  tapeSlots: TapeSlot[];
};

/** A one-off hoop Osha has already made. Managed from the dashboard, stored in DynamoDB. */
export type ReadyMadeStatus = 'draft' | 'available' | 'reserved' | 'sold' | 'archived';

export type ReadyMadePhoto = {
  url: string;
  /** Mandatory in the dashboard form — required for accessibility and SEO. */
  alt: string;
};

export type ReadyMadeHoop = {
  id: string;
  createdAt: string;
  title: string;
  description?: string;
  sizeInches: number;
  tubingId: TubingId;
  jointId: JointId;
  /** Free text — these are one-offs, not necessarily built from the tape catalogue. */
  tapeSummary?: string;
  pricePence: number;
  status: ReadyMadeStatus;
  photos: ReadyMadePhoto[];
  /** ISO timestamp; set while a checkout session holds this hoop. */
  reservedUntil?: string;
  /** Stripe Checkout Session id holding the reservation. */
  reservedBy?: string;
};

/** What the customer configured, and what the server re-prices from scratch. */
export type HoopConfig = {
  productId: CustomProductId;
  sizeInches: number;
  tubingId: TubingId;
  jointId: JointId;
  /** Tape option ids, one per slot the product defines. */
  tapeIds: string[];
};

// --- Cart / delivery ---------------------------------------------------------

export type CartItem =
  | { kind: 'custom'; config: HoopConfig; quantity: number }
  | { kind: 'ready-made'; hoopId: string; quantity: 1 };

export type DeliveryMethodId = 'collection' | 'uk-standard';

export type DeliveryOption = {
  id: DeliveryMethodId;
  label: string;
  description: string;
  pricePence: number;
};

// --- Orders ------------------------------------------------------------------

export type OrderStatus = 'pending' | 'paid' | 'in-progress' | 'dispatched' | 'cancelled';

export type OrderLine = {
  description: string;
  /** Snapshot of the configuration, so an order stays readable if the catalogue changes. */
  detail: string[];
  quantity: number;
  unitPence: number;
  linePence: number;
};

export type Order = {
  /**
   * Our own uuid, minted before the Stripe session exists so the reservation
   * transaction has something to key on. It travels to Stripe as session
   * metadata and comes back on the webhook, so the webhook can GetItem it
   * directly — no GSI, no lookup by session id.
   */
  id: string;
  /** Filled in once Stripe has issued the session. Handy for the dashboard link. */
  stripeSessionId?: string;
  createdAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  deliveryMethod: DeliveryMethodId;
  deliveryPence: number;
  totalPence: number;
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
  /** Ready-made hoop ids held by this order, for release on expiry. */
  reservedHoopIds: string[];
  trackingNumber?: string;
  paidAt?: string;
  dispatchedAt?: string;
};
