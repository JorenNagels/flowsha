import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ENQUIRY_LABELS, type ContactInput } from './validation.js';

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

export async function sendContactEmail(input: ContactInput): Promise<void> {
  const command = new SendEmailCommand({
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
  });

  await sesClient.send(command);
}
