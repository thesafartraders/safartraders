import { NextRequest, NextResponse } from "next/server";
import { isSmtpConfigured, sendLeadEmail, type LeadPayload } from "@/lib/mailer";
import { isHighPriority } from "@/lib/rfq";

// Very small in-memory rate limiter (per server instance) to deter spam bots.
// Not a substitute for a real WAF/captcha, but stops naive abuse.
const recentSubmissions = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const GLOBAL_LIMIT = 30;
const allowedSources = new Set(["rfq-wizard", "chatbot", "contact-form"]);

function getClientKey(req: NextRequest) {
  const proxyIp = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || req.headers.get("x-real-ip");
  return proxyIp || `fallback:${req.headers.get("user-agent") || "no-agent"}:${req.headers.get("accept-language") || "no-language"}`;
}

function hasValidEmail(email?: string) {
  if (!email) return true;
  return /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(email);
}

function clean(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : undefined;
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

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (!Number.isFinite(contentLength) || contentLength > 100_000) return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
    let body: Partial<LeadPayload> & { website?: unknown; privacyConsent?: unknown; formStartedAt?: unknown };
    try {
      const raw = await req.text();
      if (raw.length > 100_000) return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    if (body.website) return NextResponse.json({ ok: true });
    if (body.privacyConsent !== true) {
      return NextResponse.json({ ok: false, error: "Privacy-policy consent is required." }, { status: 400 });
    }
    const formStartedAt = typeof body.formStartedAt === "number" ? body.formStartedAt : 0;
    if (!Number.isFinite(formStartedAt) || formStartedAt <= 0 || Date.now() - formStartedAt < 2_500 || Date.now() - formStartedAt > 86_400_000) {
      return NextResponse.json({ ok: false, error: "Please take a moment to complete the form." }, { status: 400 });
    }
    const now = Date.now();
    pruneRecentSubmissions(now);
    const clientKey = getClientKey(req);
    const lastSubmit = recentSubmissions.get(clientKey);
    if (isGloballyRateLimited() || (lastSubmit && now - lastSubmit < RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json(
        { ok: false, error: "Please wait a moment before submitting again." },
        { status: 429 }
      );
    }

    if (!body.source || !allowedSources.has(String(body.source))) {
      return NextResponse.json({ ok: false, error: "Missing source." }, { status: 400 });
    }
    if (!body.email && !body.phone) {
      return NextResponse.json(
        { ok: false, error: "Provide at least an email or phone number." },
        { status: 400 }
      );
    }

    const lead: LeadPayload = {
      source: body.source as LeadPayload["source"],
      name: clean(body.name),
      company: clean(body.company),
      email: clean(body.email),
      phone: clean(body.phone, 100),
      country: clean(body.country, 100),
      product: clean(body.product),
      quantity: clean(body.quantity),
      destinationPort: clean(body.destinationPort),
      monthlyRequirement: clean(body.monthlyRequirement),
      timeline: clean(body.timeline),
      message: clean(body.message, 4000),
      locale: clean(body.locale, 10),
    };

    if (lead.email && !hasValidEmail(lead.email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    lead.priority = isHighPriority(lead.quantity, lead.monthlyRequirement) ? "High Priority Lead" : "Standard";

    if (!isSmtpConfigured()) {
      return NextResponse.json({ ok: false, error: "Email service is temporarily unavailable. Please use WhatsApp or email us directly.", whatsappFallback: true }, { status: 503 });
    }
    try {
      await sendLeadEmail(lead);
    } catch (err) {
      console.error("Lead email delivery failed:", err);
      return NextResponse.json({ ok: false, error: "Email service is temporarily unavailable. Please use WhatsApp or email us directly.", whatsappFallback: true }, { status: 502 });
    }

    recentSubmissions.set(clientKey, now);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead submission failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your requirement. Please try WhatsApp or email us directly." },
      { status: 500 }
    );
  }
}
