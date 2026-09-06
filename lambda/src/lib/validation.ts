import { z } from 'zod';
import { MAX_QUANTITY, MAX_SIZE_INCHES, MIN_SIZE_INCHES } from '@flowsha/shared';

export const ENQUIRY_TYPES = ['general', 'workshop', 'performance', 'shop'] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(100),
  email: z.string().trim().email('Please enter a valid email address.').max(320),
  enquiryType: z.enum(ENQUIRY_TYPES).catch('general'),
  preferredDate: z.string().trim().max(100).optional().default(''),
  message: z.string().trim().min(1, 'Please enter a message.').max(3000),
  // Honeypot: real users leave this empty. Handled (silently dropped) in the handler.
  company: z.string().max(200).optional().default(''),
  // Cloudflare Turnstile token. Verified in the handler when protection is enabled.
  // Optional so the dev Lambda (no secret configured) still accepts submissions.
  turnstileToken: z.string().max(4096).optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const ENQUIRY_LABELS: Record<(typeof ENQUIRY_TYPES)[number], string> = {
  general: 'General enquiry',
  workshop: 'Workshop / lesson booking',
  performance: 'Performance booking',
  shop: 'Hoop order',
};

// Rough email shape check used only to validate the *optional* email on the
// feedback form (contactSchema uses zod's stricter `.email()` on a required field).
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Hidden client-feedback survey (see web/src/app/feedback). Persisted to DynamoDB,
// not emailed. First/last name are required; at least one of email/phone must be
// present; every feedback answer is optional and defaults to empty/null.
export const feedbackSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Please enter your first name.').max(100),
    lastName: z.string().trim().min(1, 'Please enter your last name.').max(100),
    email: z.string().trim().max(320).optional().default(''),
    phone: z.string().trim().max(50).optional().default(''),
    newsletter: z.boolean().optional().default(false),

    // Scales — null when skipped.
    difficulty: z.number().int().min(1).max(10).nullable().optional().default(null),
    supported: z.number().int().min(0).max(10).nullable().optional().default(null),

    // Class-times question: preferred day/time slots + a free-text note.
    preferredSlots: z.array(z.string().max(40)).max(30).optional().default([]),
    convenienceNote: z.string().trim().max(3000).optional().default(''),

    improvements: z.string().trim().max(3000).optional().default(''),

    // Single-select answers (option values validated on the client; kept as
    // bounded strings here so the schema doesn't drift from the UI option lists).
    source: z.string().trim().max(60).optional().default(''),
    sourceOther: z.string().trim().max(200).optional().default(''),
    learningStyle: z.string().trim().max(60).optional().default(''),
    learningStyleOther: z.string().trim().max(200).optional().default(''),
    courseInterest: z.string().trim().max(20).optional().default(''),
    groupChat: z.string().trim().max(20).optional().default(''),

    // Honeypot: real users leave this empty. Dropped silently in the handler.
    company: z.string().max(200).optional().default(''),
    // Cloudflare Turnstile token — verified in the handler when protection is on.
    turnstileToken: z.string().max(4096).optional().default(''),
  })
  .refine((d) => d.email !== '' || d.phone !== '', {
    message: 'Please leave an email address or a phone number so I can reach you.',
    path: ['email'],
  })
  .refine((d) => d.email === '' || EMAIL_RE.test(d.email), {
    message: 'Please enter a valid email address.',
    path: ['email'],
  });

export type FeedbackInput = z.infer<typeof feedbackSchema>;

// --- PAR-Q + Informed Consent waiver (see web/src/app/waiver) ---------------
// Persisted to DynamoDB (POST /waiver), never emailed to the signer. The typed
// full name + the three acceptance checkboxes form a simple electronic
// signature; the handler stamps an audit trail (IP, user-agent, this version).
//
// WAIVER_VERSION identifies the exact wording a signer agreed to. BUMP IT
// whenever the waiver text in web/src/lib/data.ts changes, so stored records
// stay tied to the version that was actually shown.
export const WAIVER_VERSION = '2026-07-v1';

const YES_NO = ['yes', 'no'] as const;

// Age in whole years from a YYYY-MM-DD string, or null if it isn't a valid past date.
export function ageFromDob(dob: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const d = new Date(`${dob}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  if (d.getTime() > now.getTime()) return null; // future DOB
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return age;
}

export const waiverSchema = z
  .object({
    // Personal details (all required).
    fullName: z.string().trim().min(1, 'Please enter your full name.').max(100),
    dateOfBirth: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter your date of birth.'),
    address: z.string().trim().min(1, 'Please enter your address.').max(300),
    phone: z.string().trim().min(1, 'Please enter a phone number.').max(50),
    email: z.string().trim().email('Please enter a valid email address.').max(320),

    // Emergency contact (required).
    emergencyName: z.string().trim().min(1, 'Please enter an emergency contact name.').max(100),
    emergencyPhone: z
      .string()
      .trim()
      .min(1, 'Please enter an emergency contact phone number.')
      .max(50),

    // Medical representation — optional free-text detail.
    medicalDetails: z.string().trim().max(3000).optional().default(''),

    // Explicit yes/no choices.
    photoConsent: z.enum(YES_NO, {
      errorMap: () => ({ message: 'Please choose whether you consent to photos and video.' }),
    }),
    groupChat: z.enum(YES_NO, {
      errorMap: () => ({ message: 'Please choose whether you’d like to join the community chat.' }),
    }),

    // Acknowledgements — must all be ticked (the signature act).
    acceptRisk: z.literal(true, {
      errorMap: () => ({ message: 'Please confirm you accept the assumption of risk.' }),
    }),
    acceptMedical: z.literal(true, {
      errorMap: () => ({ message: 'Please confirm the medical representation.' }),
    }),
    acceptConsent: z.literal(true, {
      errorMap: () => ({ message: 'Please confirm you have read and accept this waiver.' }),
    }),

    // Typed-name signature. Required for adults; for under-18s the guardian
    // signs instead (enforced in superRefine below).
    signatureName: z.string().trim().max(100).optional().default(''),

    // Parent/guardian details — required only when the participant is under 18.
    guardianName: z.string().trim().max(100).optional().default(''),
    guardianRelationship: z.string().trim().max(100).optional().default(''),
    guardianSignature: z.string().trim().max(100).optional().default(''),

    // Honeypot: real users leave this empty. Dropped silently in the handler.
    company: z.string().max(200).optional().default(''),
    // Cloudflare Turnstile token — verified in the handler when protection is on.
    turnstileToken: z.string().max(4096).optional().default(''),
  })
  .superRefine((d, ctx) => {
    const age = ageFromDob(d.dateOfBirth);
    if (age === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dateOfBirth'],
        message: 'Please enter a valid date of birth.',
      });
      return;
    }
    if (age < 18) {
      // Minor: a parent/guardian must complete and sign on their behalf.
      if (d.guardianName === '')
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardianName'],
          message: 'A parent or guardian must sign for a participant under 18.',
        });
      if (d.guardianRelationship === '')
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardianRelationship'],
          message: 'Please enter the guardian’s relationship to the participant.',
        });
      if (d.guardianSignature === '')
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardianSignature'],
          message: 'Please enter the guardian’s name as their signature.',
        });
    } else if (d.signatureName === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['signatureName'],
        message: 'Please type your name to sign.',
      });
    }
  });

export type WaiverInput = z.infer<typeof waiverSchema>;

export function formatZodError(error: z.ZodError): string {
  return error.issues.map((i) => i.message).join(' ');
}

// --- Shop -------------------------------------------------------------------

// Option ids and bounds come from @flowsha/shared, so the schema can never drift
// from the price table it is validating against.
const customItemSchema = z.object({
  kind: z.literal('custom'),
  config: z.object({
    productId: z.enum(['simple-spiral', 'all-shiny']),
    sizeInches: z.number().int().min(MIN_SIZE_INCHES).max(MAX_SIZE_INCHES),
    tubingId: z.enum(['skinny', 'regular']),
    jointId: z.enum(['fixed', 'collapsible']),
    // One entry per tape slot; '' means an optional slot was left unchosen.
    tapeIds: z.array(z.string().max(64)).max(4),
  }),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

// Ready-made hoops are one-offs, so the quantity is always exactly 1.
const readyMadeItemSchema = z.object({
  kind: z.literal('ready-made'),
  hoopId: z.string().trim().min(1).max(64),
  quantity: z.literal(1),
});

export const cartItemSchema = z.discriminatedUnion('kind', [customItemSchema, readyMadeItemSchema]);

// NOTE: no price field anywhere. The Lambda re-prices the whole basket from the
// shared table; anything the browser thinks it costs is display-only.
export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Your basket is empty.').max(20),
  deliveryMethod: z.enum(['collection', 'uk-standard']),
  email: z.string().trim().email('Please enter a valid email address.').max(320),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: 'Please accept the terms and cancellation policy to continue.' }),
  }),
  company: z.string().max(200).optional().default(''),
  turnstileToken: z.string().max(4096).optional().default(''),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Photo upload: the browser resizes to WebP before asking for a presigned PUT.
// The size cap is re-enforced server-side when signing — a browser-side limit is
// a suggestion, not a control.
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

export const uploadRequestSchema = z.object({
  contentType: z.enum(['image/webp', 'image/jpeg', 'image/png']),
  contentLength: z.number().int().min(1).max(MAX_UPLOAD_BYTES),
});

export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;

export const adminProductSchema = z.object({
  // Absent on create, present on edit.
  id: z.string().trim().max(64).optional(),
  title: z.string().trim().min(1, 'Please give the hoop a title.').max(200),
  description: z.string().trim().max(3000).optional().default(''),
  sizeInches: z.number().int().min(MIN_SIZE_INCHES).max(MAX_SIZE_INCHES),
  tubingId: z.enum(['skinny', 'regular']),
  jointId: z.enum(['fixed', 'collapsible']),
  tapeSummary: z.string().trim().max(500).optional().default(''),
  pricePence: z.number().int().min(1, 'Please set a price.').max(10_000_00),
  status: z.enum(['draft', 'available', 'reserved', 'sold', 'archived']),
  photos: z
    .array(
      z.object({
        url: z.string().trim().min(1).max(500),
        // Mandatory, not optional-and-always-skipped: it is required for both
        // accessibility and SEO.
        alt: z.string().trim().min(1, 'Every photo needs alt text.').max(300),
      }),
    )
    .max(12)
    .default([]),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export const adminOrderPatchSchema = z.object({
  id: z.string().trim().min(1).max(200),
  status: z.enum(['paid', 'in-progress', 'dispatched', 'cancelled']),
  trackingNumber: z.string().trim().max(100).optional(),
});

export type AdminOrderPatchInput = z.infer<typeof adminOrderPatchSchema>;
