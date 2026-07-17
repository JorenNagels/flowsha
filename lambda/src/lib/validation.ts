import { z } from 'zod';

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

export function formatZodError(error: z.ZodError): string {
  return error.issues.map((i) => i.message).join(' ');
}
