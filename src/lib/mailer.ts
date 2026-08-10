import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site-config";

/**
 * Shared SMTP transport for sending lead-notification emails.
 *
 * Required environment variables (set in .env.local, and in your hosting
 * provider's environment settings for production):
 *
 *   SMTP_HOST=smtp.yourprovider.com
 *   SMTP_PORT=587
 *   SMTP_USER=your-smtp-username
 *   SMTP_PASS=your-smtp-password
 *   LEAD_NOTIFY_EMAIL=safartradersofficials@gmail.com   (where leads are sent; defaults to siteConfig.email)
 *   LEAD_FROM_EMAIL="Safar Traders Website <safartradersofficials@gmail.com>" (must be a verified sender for your SMTP provider)
 *
 * Any standard SMTP provider works: Resend, Postmark, SendGrid, Amazon SES,
 * Zoho Mail, Google Workspace, etc. Just fill in the host/port/user/pass
 * they give you.
 */

export function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.LEAD_FROM_EMAIL
  );
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in your environment."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export type LeadPayload = {
  source: "rfq-wizard" | "chatbot" | "contact-form";
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  product?: string;
  quantity?: string;
  destinationPort?: string;
  monthlyRequirement?: string;
  timeline?: string;
  message?: string;
  priority?: "Standard" | "High Priority Lead";
  locale?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderRow(label: string, value?: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 12px;font-size:13px;color:#555555;border-bottom:1px solid #E5E5E5;white-space:nowrap;font-family:Arial,sans-serif;">${escapeHtml(
      label
    )}</td>
    <td style="padding:8px 12px;font-size:13px;color:#111111;border-bottom:1px solid #E5E5E5;font-family:Arial,sans-serif;">${escapeHtml(
      value
    )}</td>
  </tr>`;
}

export async function sendLeadEmail(lead: LeadPayload) {
  const transport = getTransport();
  const to = process.env.LEAD_NOTIFY_EMAIL || siteConfig.email;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!from) {
    throw new Error("SMTP is configured but LEAD_FROM_EMAIL is missing. Set it to a verified sender address.");
  }

  const sourceLabel =
    lead.source === "rfq-wizard"
      ? "Request a Quote Wizard"
      : lead.source === "chatbot"
      ? "Sourcing Desk Chat"
      : "Contact Form";

  const subject = `${lead.priority === "High Priority Lead" ? "[HIGH PRIORITY] " : ""}New Lead — ${sourceLabel}${
    lead.company ? ` — ${lead.company}` : ""
  }`;

  const html = `
  <div style="background:#F5F5F7;padding:32px 16px;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E5E5;border-radius:12px;overflow:hidden;">
      <div style="background:#111111;padding:20px 24px;">
        <p style="margin:0;color:#FFFFFF;font-size:15px;font-weight:600;letter-spacing:0.02em;">${escapeHtml(
          sourceLabel
        )}</p>
        ${
          lead.priority === "High Priority Lead"
            ? '<p style="margin:4px 0 0;color:#E5E5E5;font-size:12px;">⚑ Marked as High Priority Lead</p>'
            : ""
        }
      </div>
      <div style="padding:8px 0;">
        <table style="width:100%;border-collapse:collapse;">
          ${renderRow("Name", lead.name)}
          ${renderRow("Company", lead.company)}
          ${renderRow("Email", lead.email)}
          ${renderRow("Phone / WhatsApp", lead.phone)}
          ${renderRow("Country", lead.country)}
          ${renderRow("Product / Material", lead.product)}
          ${renderRow("Quantity", lead.quantity)}
          ${renderRow("Destination Port", lead.destinationPort)}
          ${renderRow("Monthly Requirement", lead.monthlyRequirement)}
          ${renderRow("Target Timeline", lead.timeline)}
          ${renderRow("Locale", lead.locale)}
        </table>
        ${
          lead.message
            ? `<div style="padding:16px 24px;">
                <p style="margin:0 0 4px;font-size:12px;color:#555555;text-transform:uppercase;letter-spacing:0.06em;">Message</p>
                <p style="margin:0;font-size:14px;color:#111111;white-space:pre-wrap;line-height:1.6;">${escapeHtml(
                  lead.message
                )}</p>
              </div>`
            : ""
        }
      </div>
      <div style="padding:14px 24px;background:#F5F5F7;border-top:1px solid #E5E5E5;">
        <p style="margin:0;font-size:11px;color:#555555;">Sent automatically from ${escapeHtml(
          siteConfig.name
        )} website lead capture.</p>
        <p style="margin:6px 0 0;font-size:11px;color:#555555;">Handle this personal data only for the submitted trade requirement and according to the published privacy policy.</p>
      </div>
    </div>
  </div>`;

  const text = [
    `${sourceLabel}`,
    lead.priority ? `Priority: ${lead.priority}` : undefined,
    lead.name ? `Name: ${lead.name}` : undefined,
    lead.company ? `Company: ${lead.company}` : undefined,
    lead.email ? `Email: ${lead.email}` : undefined,
    lead.phone ? `Phone: ${lead.phone}` : undefined,
    lead.country ? `Country: ${lead.country}` : undefined,
    lead.product ? `Product: ${lead.product}` : undefined,
    lead.quantity ? `Quantity: ${lead.quantity}` : undefined,
    lead.destinationPort ? `Destination Port: ${lead.destinationPort}` : undefined,
    lead.monthlyRequirement ? `Monthly Requirement: ${lead.monthlyRequirement}` : undefined,
    lead.timeline ? `Timeline: ${lead.timeline}` : undefined,
    lead.locale ? `Locale: ${lead.locale}` : undefined,
    lead.message ? `Message: ${lead.message}` : undefined,
  ].filter(Boolean).join("\n");

  await transport.sendMail({
    from,
    to,
    replyTo: lead.email || undefined,
    subject,
    text,
    html,
    attachments: lead.attachments,
  });
}
