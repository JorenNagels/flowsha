import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ENQUIRY_LABELS, type ContactInput, type WaiverInput } from './validation.js';

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || 'eu-west-2',
});

const TO_EMAIL = process.env.TO_EMAIL || '';
const FROM_EMAIL = process.env.FROM_EMAIL || '';

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #efe5d1;color:#7a5240;font-weight:600;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #efe5d1;color:#2e2a24;">${escapeHtml(value).replace(/\n/g, '<br/>')}</td>
    </tr>`;
}

function buildHtml(input: ContactInput): string {
  const rows = [
    row('Name', input.name),
    row('Email', input.email),
    row('Enquiry', ENQUIRY_LABELS[input.enquiryType]),
    input.preferredDate ? row('Preferred date', input.preferredDate) : '',
    row('Message', input.message),
  ].join('');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background-color:#f7f1e3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f1e3;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
        <tr><td style="background-color:#2c3f2a;padding:28px 32px;">
          <h1 style="color:#d8a534;margin:0;font-size:22px;font-weight:400;letter-spacing:1px;">New enquiry — Flowsha</h1>
        </td></tr>
        <tr><td style="padding:8px 16px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildText(input: ContactInput): string {
  return [
    'New enquiry — Flowsha',
    '',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Enquiry: ${ENQUIRY_LABELS[input.enquiryType]}`,
    input.preferredDate ? `Preferred date: ${input.preferredDate}` : '',
    '',
    'Message:',
    input.message,
  ]
    .filter((line) => line !== '')
    .join('\n');
}

// --- Customer auto-reply: a warm, on-brand confirmation echoing their message. ---
//     Colours mirror the website's Tailwind theme (cream/forest/mustard/clay).
function buildConfirmationHtml(input: ContactInput): string {
  const name = escapeHtml(input.name);
  const enquiry = escapeHtml(ENQUIRY_LABELS[input.enquiryType]);
  const message = escapeHtml(input.message).replace(/\n/g, '<br/>');
  const dateLine = input.preferredDate
    ? `<tr><td style="padding:0 0 6px;color:#7a5240;font-size:13px;">Preferred date: <strong style="color:#2e2a24;">${escapeHtml(input.preferredDate)}</strong></td></tr>`
    : '';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:#f7f1e3;font-family:'Helvetica Neue',Arial,sans-serif;color:#2e2a24;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f1e3;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#fffdf8;border-radius:16px;overflow:hidden;box-shadow:0 6px 18px rgba(44,63,42,0.10);">

        <!-- Header -->
        <tr><td align="center" style="background-color:#2c3f2a;padding:36px 32px 30px;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;letter-spacing:2px;color:#d8a534;">Flowsha</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:16px;color:#e8d9b5;margin-top:6px;">Find your flow</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:34px 36px 8px;">
          <p style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#2c3f2a;margin:0 0 16px;">Hi ${name},</p>
          <p style="font-size:15px;line-height:1.65;margin:0 0 14px;">
            Thank you so much for getting in touch with Flowsha. Your message has floated safely
            into my inbox &mdash; I&rsquo;ll read every word and get back to you personally as soon
            as I can. 🌀
          </p>
          <p style="font-size:15px;line-height:1.65;margin:0 0 24px;">
            Here&rsquo;s a copy of what you sent, just so you have it:
          </p>
        </td></tr>

        <!-- Message echo panel -->
        <tr><td style="padding:0 36px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3ead7;border-left:4px solid #d8a534;border-radius:8px;">
            <tr><td style="padding:18px 22px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:0 0 10px;">
                  <span style="display:inline-block;background-color:#3f5a3a;color:#f7f1e3;font-size:12px;font-weight:600;letter-spacing:0.5px;padding:5px 12px;border-radius:999px;">${enquiry}</span>
                </td></tr>
                ${dateLine}
                <tr><td style="font-size:15px;line-height:1.65;color:#2e2a24;">${message}</td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Closing -->
        <tr><td style="padding:24px 36px 6px;">
          <p style="font-size:15px;line-height:1.65;margin:0 0 18px;">
            In the meantime, come say hi and watch the hoops spin over on Instagram.
          </p>
          <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#2e2a24;margin:0;">With flow,</p>
          <p style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:24px;color:#3f5a3a;margin:2px 0 0;">Osha</p>
          <p style="font-size:13px;color:#7c8c6a;margin:2px 0 0;">Flowsha &middot; Find your flow</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:26px 36px 32px;">
          <div style="border-top:1px solid #efe5d1;padding-top:18px;">
            <p style="font-size:13px;color:#7a5240;margin:0 0 6px;">
              <a href="https://www.instagram.com/flowshaofficial/" style="color:#d2703a;text-decoration:none;font-weight:600;">@flowshaofficial</a>
              &nbsp;&middot;&nbsp;
              <a href="https://flowsha.co.uk" style="color:#d2703a;text-decoration:none;font-weight:600;">flowsha.co.uk</a>
            </p>
            <p style="font-size:12px;color:#7c8c6a;margin:0;line-height:1.5;">
              Hula hoop classes, performances &amp; handmade hoops &middot; Southampton &amp; Hampshire
            </p>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildConfirmationText(input: ContactInput): string {
  return [
    `Hi ${input.name},`,
    '',
    'Thank you so much for getting in touch with Flowsha. Your message has landed',
    "safely in my inbox — I'll get back to you personally as soon as I can.",
    '',
    "Here's a copy of what you sent:",
    '',
    `Enquiry: ${ENQUIRY_LABELS[input.enquiryType]}`,
    input.preferredDate ? `Preferred date: ${input.preferredDate}` : '',
    '',
    input.message,
    '',
    'With flow,',
    'Osha',
    'Flowsha · Find your flow',
    '',
    'Instagram: https://www.instagram.com/flowshaofficial/',
    'Web: https://flowsha.co.uk',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

export async function sendContactEmail(input: ContactInput): Promise<void> {
  // 1. Notify Osha (critical — must succeed, so this is allowed to throw → 500).
  await sesClient.send(
    new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [TO_EMAIL] },
      ReplyToAddresses: [input.email],
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: `Flowsha enquiry (${ENQUIRY_LABELS[input.enquiryType]}) — ${input.name}`,
        },
        Body: {
          Html: { Charset: 'UTF-8', Data: buildHtml(input) },
          Text: { Charset: 'UTF-8', Data: buildText(input) },
        },
      },
    }),
  );

  // 2. Auto-reply to the enquirer (best-effort). In the SES sandbox this fails
  //    for unverified recipients — never let that break the visitor's submission.
  try {
    await sesClient.send(
      new SendEmailCommand({
        Source: `Flowsha <${FROM_EMAIL}>`,
        Destination: { ToAddresses: [input.email] },
        ReplyToAddresses: [FROM_EMAIL],
        Message: {
          Subject: {
            Charset: 'UTF-8',
            Data: `Thanks for reaching out to Flowsha, ${input.name} 🌀`,
          },
          Body: {
            Html: { Charset: 'UTF-8', Data: buildConfirmationHtml(input) },
            Text: { Charset: 'UTF-8', Data: buildConfirmationText(input) },
          },
        },
      }),
    );
  } catch (err) {
    console.error('Confirmation auto-reply failed (non-fatal):', err);
  }
}

// --- Signed waiver notification (owner only) --------------------------------
//     Emails Osha a full copy of each signed PAR-Q + Informed Consent form.
//     No auto-reply to the signer yet (SES sandbox); they get an on-screen copy.

function yesNo(v: string): string {
  return v === 'yes' ? 'Yes' : 'No';
}

function buildWaiverRows(input: WaiverInput, signedAt: string): string {
  const isMinor = input.guardianName.trim() !== '';
  return [
    row('Full name', input.fullName),
    row('Date of birth', input.dateOfBirth),
    row('Address', input.address),
    row('Phone', input.phone),
    row('Email', input.email),
    row('Emergency contact', `${input.emergencyName} — ${input.emergencyPhone}`),
    input.medicalDetails ? row('Medical details', input.medicalDetails) : '',
    row('Photo/video consent', yesNo(input.photoConsent)),
    row('Community chat', yesNo(input.groupChat)),
    row('Acknowledgements', 'Assumption of risk ✓ · Medical representation ✓ · Read & accepted release ✓'),
    isMinor
      ? row(
          'Signed by (guardian)',
          `${input.guardianSignature} — ${input.guardianRelationship} of ${input.fullName}`,
        )
      : row('Signed by', input.signatureName),
    row('Signed at', signedAt),
  ].join('');
}

function buildWaiverHtml(input: WaiverInput, signedAt: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background-color:#f7f1e3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f1e3;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
        <tr><td style="background-color:#2c3f2a;padding:28px 32px;">
          <h1 style="color:#d8a534;margin:0;font-size:22px;font-weight:400;letter-spacing:1px;">New signed waiver — Flowsha</h1>
        </td></tr>
        <tr><td style="padding:8px 16px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">${buildWaiverRows(input, signedAt)}</table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildWaiverText(input: WaiverInput, signedAt: string): string {
  const isMinor = input.guardianName.trim() !== '';
  return [
    'New signed waiver — Flowsha',
    '',
    `Full name: ${input.fullName}`,
    `Date of birth: ${input.dateOfBirth}`,
    `Address: ${input.address}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `Emergency contact: ${input.emergencyName} — ${input.emergencyPhone}`,
    input.medicalDetails ? `Medical details: ${input.medicalDetails}` : '',
    `Photo/video consent: ${yesNo(input.photoConsent)}`,
    `Community chat: ${yesNo(input.groupChat)}`,
    'Acknowledgements: assumption of risk, medical representation, read & accepted release — all confirmed',
    isMinor
      ? `Signed by (guardian): ${input.guardianSignature} — ${input.guardianRelationship} of ${input.fullName}`
      : `Signed by: ${input.signatureName}`,
    `Signed at: ${signedAt}`,
  ]
    .filter((line) => line !== '')
    .join('\n');
}

export async function sendWaiverEmail(input: WaiverInput): Promise<void> {
  const signedAt = new Date().toISOString();
  await sesClient.send(
    new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [TO_EMAIL] },
      ReplyToAddresses: [input.email],
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: `Flowsha waiver signed — ${input.fullName}`,
        },
        Body: {
          Html: { Charset: 'UTF-8', Data: buildWaiverHtml(input, signedAt) },
          Text: { Charset: 'UTF-8', Data: buildWaiverText(input, signedAt) },
        },
      },
    }),
  );
}
