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

export function formatZodError(error: z.ZodError): string {
  return error.issues.map((i) => i.message).join(' ');
}
