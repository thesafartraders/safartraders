# Safar Traders — Project Voice Guide

This file governs the wording, tone, and brand narrative for all website copy,
component edits, and AI-assisted content changes. Any Claude or Codex session
working on this codebase should read this first.

---

## 1. Business Positioning

Safar Traders is a **procurement and export partner** for buyers of non-perishable
industrial and commercial goods.

The company coordinates buyer requirements through a structured process:
supplier identification → quotation → order confirmation → inspection → documentation → supply/shipment.

**What Safar Traders is:**
- Procurement and export partner
- Multi-category sourcing partner
- Merchant exporter
- Trading and export partner
- Single point of coordination for trade and supply

**What Safar Traders is not (internal reference — do not repeat on every public page):**
- Not a manufacturer
- Not an e-commerce store
- Not a recycling or scrap-yard business
- Not a food, produce, or perishables company
- Not a catalogue retailer

Mention exclusions only where buyer clarity genuinely requires it:
About page, Resources, RFQ guidance, and the chatbot system prompt.

---

## 2. Brand Narrative (use once — About page only)

> "Buyers should not have to manage multiple suppliers, documentation partners, and
> shipment coordination separately. Safar Traders brings sourcing, procurement
> coordination, documentation support, and supply handling into one clear commercial process."

This is the core brand idea. It should appear once in full — currently on the About page
under the "What we do" section. The homepage hero should not carry the full brand
narrative or explain the operating model.

Final page role:
- Homepage hero = short positioning + RFQ direction
- About page = full brand narrative / company philosophy

---

## 3. Preferred Vocabulary

Use these words and phrases:

| Preferred | Instead of |
|-----------|-----------|
| buyer | customer, client |
| requirement | order request, enquiry |
| sourcing feasibility | availability |
| quotation / commercial proposal | price, quote, estimate |
| supplier coordination | vendor management |
| procurement coordination | purchasing |
| documentation support | paperwork |
| supply handling | order fulfilment |
| trading and export partner | exporter, seller |
| non-perishable industrial and commercial goods | all products, everything |
| across markets | globally, worldwide, everywhere |
| domestic and export requirements | international, global (overused) |
| single point of coordination | one-stop-shop (avoid) |
| sourcing scope | product catalogue |
| trade and supply | general trading (overused) |

---

## 4. Words and Phrases to Avoid

**Marketing hype — never use:**
- leading, best, world-class, top-quality, premium, cheapest
- guaranteed supply, instant quote, fastest delivery
- we export everything, all products, any product

**Identity confusion — never use as the company's identity:**
- recycling company
- scrap yard / scrap exporter
- waste management
- manufacturer
- e-commerce store
- product catalogue

**Overused in Phase 1 — reduce usage:**
- "General Trading" — acceptable once in About page metadata or footer legal line; do not repeat in headlines or body copy across multiple pages
- "Domestic and international" — use on Homepage and About page only; elsewhere use lighter alternatives like "across markets", "for trade and export requirements", "local and export requirements"
- "Non-perishable" — important qualifier but do not repeat on every page; once in hero copy and once in about page is sufficient

---

## 5. Tone Rules

- **Calm and operational.** Sounds like a trading house, not a startup pitch.
- **Buyer-facing, not self-promotional.** Every sentence should be useful to the buyer, not just reassuring to the company.
- **Concise.** No paragraph longer than 3 sentences in body copy. Avoid stacking adjectives.
- **No hype.** Do not use exclamation marks in body copy. Do not over-promise.
- **Consistent person.** Use "we" and "our" for Safar Traders. Use "you" and "your" for the buyer. Avoid third-person references to "the company" in public-facing copy.
- **No AI-sounding copy.** Avoid phrases like "seamlessly", "cutting-edge", "leverage", "robust", "state-of-the-art", "end-to-end solution" (unless used plainly).

---

## 6. Page-Level Guidance

### Homepage (`src/app/page.tsx` + `src/components/Hero.tsx`)
- Hero headline: concise, buyer-benefit focused
- Hero copy: short positioning only — one paragraph maximum
- Keep hero copy close to: "Safar Traders supports buyer-led sourcing, procurement coordination, and export supply for non-perishable industrial and commercial requirements."
- Do NOT repeat the brand narrative paragraph here (it lives on About)
- Do NOT explain the whole operating model in the hero
- Proof strip cards: three short operational signals (sourcing, documentation, supply scope)
- Homepage metadata: do not keyword-stuff; one clear sentence about what the company does

### About (`src/app/about/page.tsx`)
- PageHero: "procurement and export partner" framing — not "general trading company"
- Brand narrative paragraph: this is the ONE place it appears in full
- "What we do" section: practical, operational
- Values section: four operational principles — keep as-is (Specification-first, Document-complete, Buyer-responsive, Compliance-aware)
- CTA: short and practical — "Have a sourcing requirement?"

### Capabilities / Products (`src/app/products/page.tsx`)
- PageHero: buyer-first framing — "we work from your requirement, not a catalogue"
- Do not say "domestic and international" here
- Category cards: describe what can be sourced and to what specification, not who we are

### Export / Trade Process (`src/app/export-process/page.tsx`)
- Title metadata: keep "Export Process" as the page title (it's navigational)
- PageHero eyebrow: "Trade Process" is correct
- FAQs: practical, honest — do not over-promise on MOQ or Incoterms

### Why Us (`src/app/why-us/page.tsx`)
- Six reasons — keep operational (not identity-based)
- PageHero: "one partner, clear process" framing is correct

### Resources (`src/app/resources/page.tsx`)
- Practical buyer guidance — not blog content
- Eyebrow: sentence case ("Buyer resources", not "BUYER RESOURCES")
- Each resource card: checklist + why it matters — current structure is correct

### Contact / RFQ (`src/app/contact/page.tsx`)
- Frame as a quotation request, not a casual enquiry
- "Buyer note" should mention: specification, quantity, destination, timeline
- Do not use the word "enquiry" — use "requirement" or "RFQ"

### Chatbot (`src/app/api/chat/route.ts`)
- Lead with what we do, not what we are not
- Keep perishables exclusion as a factual rule, not defensive identity
- Guardrails: no pricing promises, no availability guarantees, no contract negotiation
- Welcome message: short — one sentence maximum

### Footer (`src/components/Footer.tsx`)
- Brand tagline: "Trade and export partner for buyers sourcing non-perishable industrial and commercial goods"
- Footer bottom: "Trade & export · Procurement coordination · Documentation support"
- Do not repeat "General Trading" here

---

## 7. Phase 2 Pending Items

These are wording or architecture issues deferred to Phase 2:

1. **`seoTitle` fields in `src/lib/products.ts`** — still say "from India" which frames as export-only. Review once domestic sourcing scope is confirmed.
2. **Category architecture** — "General Sourcing" as a category slug may need renaming. Defer to Phase 2.
3. **`/export-process` URL slug** — nav label is "Process" but route is `/export-process`. If domestic supply becomes a larger focus, consider renaming the route to `/trade-process`. Defer.
4. **Resources page** — currently export/import focused. If domestic buyer guides are needed, add a separate section in Phase 2.
5. **`src/components/ProductDetailPage.tsx`** — "Category overview" section heading and buyer note language could be tightened in Phase 2 during category architecture work.
