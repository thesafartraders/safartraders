import { NextRequest, NextResponse } from "next/server";
import { generateRfqPdf } from "@/lib/rfq-pdf";
import {
  makeRfqId,
  isHighPriority,
  normalizeRfqPayload,
  rfqMissingFields,
  rfqToMessage,
  type RfqSubmitResponse,
} from "@/lib/rfq";
import { isSmtpConfigured, sendLeadEmail, type LeadPayload } from "@/lib/mailer";
import {
  buildManualWhatsAppUrl,
  getSafarWhatsAppRecipient,
  isWhatsAppConfigured,
  sendWhatsAppDocument,
  sendWhatsAppTemplate,
} from "@/lib/whatsapp";

export const runtime = "nodejs";

const recentSubmissions = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const GLOBAL_LIMIT = 20;
const RECIPIENT_WINDOW_MS = 60 * 60_000;
const RECIPIENT_LIMIT = 2;
const recentRecipients = new Map<string, number[]>();

function isValidPhoneNumber(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

function getClientKey(req: NextRequest) {
  const forwarded = req.headers.get("x-vercel-forwarded-for") || req.headers.get("cf-connecting-ip");
  // These headers are trusted only when a deployment proxy supplies them. The
  // fingerprint fallback keeps a missing-IP host from becoming one global bucket.
  const proxyIp = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || forwarded || req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || req.headers.get("x-real-ip");
  return proxyIp || `fallback:${req.headers.get("user-agent") || "no-agent"}:${req.headers.get("accept-language") || "no-language"}`;
}

function hasValidEmail(email: string) {
  return /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(email);
}

function pruneRecentSubmissions(now: number) {
  for (const [key, timestamp] of recentSubmissions) {
    if (now - timestamp >= RATE_LIMIT_WINDOW_MS) recentSubmissions.delete(key);
  }
}

let globalHits = 0;
let globalWindowStart = Date.now();
function isGloballyRateLimited() {
  const now = Date.now();
  if (now - globalWindowStart >= RATE_LIMIT_WINDOW_MS) { globalWindowStart = now; globalHits = 0; }
  globalHits += 1;
  return globalHits > GLOBAL_LIMIT;
}

function recipientLimited(digits: string) {
  const now = Date.now();
  for (const [key, timestamps] of recentRecipients) {
    if (!timestamps.some((time) => now - time < RECIPIENT_WINDOW_MS)) recentRecipients.delete(key);
  }
  const recent = (recentRecipients.get(digits) || []).filter((time) => now - time < RECIPIENT_WINDOW_MS);
  if (recent.length >= RECIPIENT_LIMIT) { recentRecipients.set(digits, recent); return true; }
  recent.push(now);
  recentRecipients.set(digits, recent);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (!Number.isFinite(contentLength) || contentLength > 100_000) return NextResponse.json<RfqSubmitResponse>({ ok: false, error: "Payload too large." }, { status: 413 });
    let body: unknown;
    try {
      const raw = await req.text();
      if (raw.length > 100_000) return NextResponse.json<RfqSubmitResponse>({ ok: false, error: "Payload too large." }, { status: 413 });
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json<RfqSubmitResponse>({ ok: false, error: "Invalid request body." }, { status: 400 });
    }

    // Honeypots are deliberately handled before validation and rate limiting.
    if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
      return NextResponse.json<RfqSubmitResponse>({ ok: true });
    }
    const formStartedAt = body && typeof body === "object" ? (body as Record<string, unknown>).formStartedAt : undefined;
    if (typeof formStartedAt !== "number" || !Number.isFinite(formStartedAt) || Date.now() - formStartedAt < 2_500 || Date.now() - formStartedAt > 86_400_000) {
      return NextResponse.json<RfqSubmitResponse>({ ok: false, error: "Please take a moment to complete the form." }, { status: 400 });
    }

    const now = Date.now();
    pruneRecentSubmissions(now);
    const clientKey = getClientKey(req);
    const lastSubmit = recentSubmissions.get(clientKey);
    if (isGloballyRateLimited() || (lastSubmit && now - lastSubmit < RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json<RfqSubmitResponse>(
        { ok: false, error: "Please wait a moment before submitting again." },
        { status: 429 }
      );
    }

    // Reserve before costly side effects so concurrent requests cannot duplicate a lead.
    recentSubmissions.set(clientKey, now);
    const rfq = normalizeRfqPayload(body as Record<string, unknown>);
    const whatsappDigits = rfq.whatsapp?.replace(/\D/g, "") || "";
    if (rfq.whatsappConsent && rfq.whatsapp && (whatsappDigits.length < 10 || whatsappDigits.length > 15)) rfq.whatsapp = "";
    const missing = rfqMissingFields(rfq);
    if (missing.length > 0) {
      return NextResponse.json<RfqSubmitResponse>(
        { ok: false, error: `Missing required RFQ fields: ${missing.join(", ")}.` },
        { status: 400 }
      );
    }
    if (rfq.email && !hasValidEmail(rfq.email)) {
      return NextResponse.json<RfqSubmitResponse>(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (!isValidPhoneNumber(rfq.phone)) {
      return NextResponse.json<RfqSubmitResponse>({ ok: false, error: "Please enter a valid phone number." }, { status: 400 });
    }

    const rfqId = makeRfqId();
    const pdfFileName = `${rfqId}-Safar-Traders-RFQ-Summary.pdf`;
    const pdf = await generateRfqPdf({ rfq, rfqId });
    const priority: LeadPayload["priority"] = isHighPriority(rfq.quantity, rfq.monthlyRequirement) ? "High Priority Lead" : "Standard";

    let emailSent = false;
    let emailNote = "";
    if (isSmtpConfigured()) {
      try {
        await sendLeadEmail({
        source: "rfq-wizard",
        name: rfq.contactPerson,
        company: rfq.companyName,
        email: rfq.email,
        phone: rfq.phone,
        country: rfq.destinationCountry,
        product: rfq.requirement,
        quantity: rfq.quantity,
        destinationPort: rfq.destinationPort,
        monthlyRequirement: rfq.monthlyRequirement,
        timeline: rfq.timeline,
        message: [`RFQ ID: ${rfqId}`, rfqToMessage(rfq)].filter(Boolean).join("\n"),
        priority,
        attachments: [{ filename: pdfFileName, content: pdf, contentType: "application/pdf" }],
        });
        emailSent = true;
      } catch (err) {
        emailNote = "Email delivery failed. PDF download and manual WhatsApp sharing are still available.";
        console.error("RFQ email delivery failed:", err);
      }
    } else {
      emailNote = "Email delivery is not configured. PDF download and manual WhatsApp sharing are still available.";
    }

    const caption = `${rfqId} - Safar Traders RFQ Summary. This is a requirement summary for feasibility review, not a price quotation.`;
    const teamResult = isWhatsAppConfigured()
      ? await sendWhatsAppDocument({
          to: getSafarWhatsAppRecipient(),
          pdf,
          fileName: pdfFileName,
          caption,
        })
      : { sent: false, reason: "WhatsApp API credentials are not configured." };

    const buyerTemplate = process.env.WHATSAPP_BUYER_TEMPLATE_NAME;
    const buyerResult = rfq.whatsappConsent && whatsappDigits && rfq.whatsapp && !recipientLimited(whatsappDigits) && isWhatsAppConfigured() && buyerTemplate
      ? await sendWhatsAppTemplate(rfq.whatsapp, buyerTemplate, [
          { type: "body", parameters: [{ type: "text", text: rfq.contactPerson }, { type: "text", text: rfqId }] },
        ])
      : {
          sent: false,
          reason: rfq.whatsappConsent ? "Buyer WhatsApp template, number, or API credentials are missing." : "Buyer did not consent to WhatsApp delivery.",
        };

    const manualMessage = [
      `Hello Safar Traders, I would like to submit RFQ ${rfqId}.`,
      `Company: ${rfq.companyName}`,
      `Contact: ${rfq.contactPerson}`,
      `Phone: ${rfq.phone}`,
      rfq.email && `Email: ${rfq.email}`,
      `Requirement: ${rfq.requirement}`,
      `Quantity: ${rfq.quantity}`,
      rfq.gradeSpecification && `Specification: ${rfq.gradeSpecification}`,
      `Destination: ${[rfq.destinationPort, rfq.destinationState, rfq.destinationCountry, rfq.destinationZip].filter(Boolean).join(", ")}`,
      rfq.timeline && `Timeline: ${rfq.timeline}`,
      "The RFQ Summary PDF has been downloaded from the website.",
    ].join("\n");

    return NextResponse.json<RfqSubmitResponse>({
      ok: true,
      rfqId,
      pdfFileName,
      pdfBase64: pdf.toString("base64"),
      emailSent,
      emailNote,
      whatsappTeamSent: teamResult.sent,
      whatsappBuyerSent: buyerResult.sent,
      whatsappManualUrl: buildManualWhatsAppUrl(manualMessage, getSafarWhatsAppRecipient()),
      whatsappNote: buyerResult.sent
        ? "WhatsApp confirmation was sent using the approved buyer template."
        : buyerResult.reason || teamResult.reason || "Manual WhatsApp sharing is available.",
    });
  } catch (err) {
    console.error("Structured RFQ submission failed:", err);
    return NextResponse.json<RfqSubmitResponse>(
      { ok: false, error: "Something went wrong sending your RFQ. Please try WhatsApp or email us directly." },
      { status: 500 }
    );
  }
}
