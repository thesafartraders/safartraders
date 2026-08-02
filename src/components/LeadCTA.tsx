"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { productCategories } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";
import { waLink } from "@/lib/whatsapp";

export default function LeadCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappFallback, setWhatsappFallback] = useState(false);
  const formStartedAt = useRef(0);
  useEffect(() => { formStartedAt.current = Date.now(); }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setWhatsappFallback(false);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact-form",
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          phone: data.get("phone"),
          country: data.get("country"),
          product: data.get("category"),
          quantity: data.get("quantity"),
          destinationPort: data.get("destinationPort"),
          message: data.get("message"),
          website: data.get("website"),
          privacyConsent: data.get("privacyConsent") === "on",
          formStartedAt: formStartedAt.current,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setWhatsappFallback(Boolean(json.whatsappFallback));
        throw new Error(json.error || "Submission failed");
      }
      setSubmitted(true);
      form.reset();
      formStartedAt.current = Date.now();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please use WhatsApp or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-pad bg-white section-border" id="request-quote">
      <div className="container-site">
        <div className="lead-heading">
          <span className="eyebrow lead-eyebrow">Request a Quote</span>
          <h2 className="section-title lead-title">Send the details a sourcing team needs.</h2>
          <p className="section-copy lead-copy">
            A useful RFQ includes the product, specification or grade, quantity, destination port, and timeline. We review feasibility before discussing commercial terms.
          </p>
        </div>
        <div className="lead-grid">
        <div>
          <div className="rfq-points" aria-label="RFQ details checklist">
            <p><strong>Product:</strong> category, grade, standard, application</p>
            <p><strong>Quantity:</strong> trial order, container load, or monthly demand</p>
            <p><strong>Destination:</strong> country, port, Incoterm preference if known</p>
          </div>

          <div className="direct-contact">
            <a href={`tel:${siteConfig.phoneRaw}`}><Phone size={15} aria-hidden="true" />{siteConfig.phone}</a>
            <a href={`tel:${siteConfig.phoneSecondaryRaw}`}><Phone size={15} aria-hidden="true" />{siteConfig.phoneSecondary}</a>
            <a href={`mailto:${siteConfig.email}`}><Mail size={15} aria-hidden="true" />{siteConfig.email}</a>
            <a href={waLink(siteConfig.whatsappRaw, "Hello Safar Traders, I'd like to discuss a sourcing/export requirement.")} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} aria-hidden="true" />WhatsApp requirement</a>
          </div>
        </div>

        <div className="lead-form-card">
          {submitted ? (
            <div className="success-state" role="status">
              <h3>RFQ received.</h3>
              <p>Thank you. Your requirement has been sent to the Safar Traders team for review.</p>
              <button type="button" className="btn btn-secondary" onClick={() => setSubmitted(false)}>Submit another RFQ</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="lead-form">
              <div className="hidden-field" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="form-row-2">
                <div>
                  <label className="form-label" htmlFor="name">Contact person *</label>
                  <input className="form-input" id="name" type="text" name="name" autoComplete="name" required />
                </div>
                <div>
                  <label className="form-label" htmlFor="company">Company *</label>
                  <input className="form-input" id="company" type="text" name="company" autoComplete="organization" required />
                </div>
              </div>

              <div className="form-row-2">
                <div>
                  <label className="form-label form-label-optional" htmlFor="email">Email <span className="optional-tag">(email or phone required)</span></label>
                  <input className="form-input" id="email" type="email" name="email" autoComplete="email" />
                </div>
                <div>
                  <label className="form-label form-label-optional" htmlFor="phone">Phone / WhatsApp <span className="optional-tag">(email or phone required)</span></label>
                  <input className="form-input" id="phone" type="tel" name="phone" autoComplete="tel" />
                </div>
              </div>

              <div className="form-row-2">
                <div>
                  <label className="form-label" htmlFor="category">Category *</label>
                  <select className="form-input" id="category" name="category" required defaultValue="">
                    <option value="" disabled>Select category</option>
                    {productCategories.map((category) => <option key={category.slug} value={category.shortTitle}>{category.shortTitle}</option>)}
                    <option value="Other industrial requirement">Other industrial requirement</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="quantity">Quantity / frequency *</label>
                  <input className="form-input" id="quantity" type="text" name="quantity" placeholder="e.g. 2 containers / month" required />
                </div>
              </div>

              <div className="form-row-2">
                <div>
                  <label className="form-label form-label-optional" htmlFor="country">Country <span className="optional-tag">(optional)</span></label>
                  <input className="form-input" id="country" type="text" name="country" autoComplete="country-name" />
                </div>
                <div>
                  <label className="form-label form-label-optional" htmlFor="destinationPort">Destination port <span className="optional-tag">(optional)</span></label>
                  <input className="form-input" id="destinationPort" type="text" name="destinationPort" placeholder="e.g. Jebel Ali, UAE" />
                </div>
              </div>

              <div>
                <label className="form-label form-label-optional" htmlFor="message">Specification / notes <span className="optional-tag">(optional — grade, packing, timeline, Incoterm)</span></label>
                <textarea className="form-input rfq-textarea-compact" id="message" name="message" rows={2} placeholder="Grade, standard, packing, inspection, Incoterm, or timeline." />
              </div>

              {error && <div className="form-error" role="alert"><p>{error}</p>{whatsappFallback && <a href={waLink(siteConfig.whatsappRaw, "Hello Safar Traders, I'd like to submit an RFQ.")} target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a>}</div>}
              <label className="form-note" style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", margin: 0 }}>
                <input type="checkbox" name="privacyConsent" required style={{ marginTop: "0.2rem" }} />
                <span>I agree to the processing of my details as described in the <Link href={siteConfig.legal.privacyPolicyUrl}>Privacy Policy</Link>.</span>
              </label>
              <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
                {submitting ? "Submitting..." : <>Submit RFQ <ArrowRight size={15} aria-hidden="true" /></>}
              </button>
              <p className="form-note">No pricing is promised before requirement review. This keeps quotations accurate and commercially usable.</p>
            </form>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
