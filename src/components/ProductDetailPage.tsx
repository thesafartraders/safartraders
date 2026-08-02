"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, FileText, PackageCheck, ChevronRight } from "lucide-react";
import { catalogImages, type ProductCategory, productCategories } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import { waLink } from "@/lib/whatsapp";

interface Props { category: ProductCategory; }

const COUNTRIES = [
  "United Arab Emirates","Saudi Arabia","United Kingdom","United States","Germany",
  "France","Netherlands","Belgium","Italy","Spain","Australia","New Zealand",
  "Singapore","Malaysia","Indonesia","Thailand","Vietnam","Philippines","Bangladesh",
  "Sri Lanka","Kenya","Nigeria","South Africa","Egypt","Tanzania","Ghana","Other",
];

function buildWhatsAppMessage(fields: Record<string, string>, categoryTitle: string) {
  return `Hello Safar Traders,

I would like to request a quotation.

Category: ${categoryTitle}
Subcategory: ${fields.subcategory || "—"}
Product / Requirement: ${fields.product || "—"}
Grade / Specification: ${fields.grade || "—"}
Quantity: ${fields.quantity || "—"}
Destination: ${fields.destination || "—"}
Timeline: ${fields.timeline || "—"}

Contact Person: ${fields.name || "—"}
Company: ${fields.company || "—"}
Country: ${fields.country || "—"}
Email: ${fields.email || "—"}
Phone / WhatsApp: ${fields.phone || "—"}

Notes:
${fields.notes || "—"}

Please review and share sourcing feasibility / quotation details.`;
}

function buildEmailMessage(fields: Record<string, string>, categoryTitle: string) {
  return `Hello Safar Traders,

I would like to request a quotation.

Category: ${categoryTitle}
Subcategory: ${fields.subcategory || "—"}
Product / Requirement: ${fields.product || "—"}
Grade / Specification: ${fields.grade || "—"}
Quantity: ${fields.quantity || "—"}
Destination: ${fields.destination || "—"}
Timeline: ${fields.timeline || "—"}

Contact Person: ${fields.name || "—"}
Company: ${fields.company || "—"}
Country: ${fields.country || "—"}
Email: ${fields.email || "—"}
Phone / WhatsApp: ${fields.phone || "—"}

Notes:
${fields.notes || "—"}

Please review and share sourcing feasibility / quotation details.`;
}

export default function ProductDetailPage({ category }: Props) {
  const formRef = useRef<HTMLDivElement>(null);
  const categoryUrl = `${siteConfig.url}/products/${category.slug}`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${categoryUrl}#service`,
    name: `${category.title} sourcing and export support`,
    description: category.metaDescription,
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    areaServed: "Worldwide",
    serviceType: category.title,
    url: categoryUrl,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${category.shortTitle} sourcing categories`,
      itemListElement: category.subcategories.map((sub) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: sub.name,
          description: sub.description,
        },
      })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Capabilities", item: `${siteConfig.url}/products` },
      { "@type": "ListItem", position: 3, name: category.title, item: categoryUrl },
    ],
  };
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", country: "",
    subcategory: "", product: "", grade: "", quantity: "",
    destination: "", timeline: "", notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const formStartedAt = useRef(0);
  useEffect(() => { formStartedAt.current = Date.now(); }, []);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [website, setWebsite] = useState("");

  const otherCategories = productCategories.filter((c) => c.slug !== category.slug).slice(0, 3);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function prefillAndScroll(subcatName: string) {
    setForm((f) => ({ ...f, subcategory: subcatName }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current?.querySelector("input")?.focus();
    }, 100);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.phone.trim() && !form.email.trim()) e.phone = "Phone or email required";
    if (!form.product.trim()) e.product = "Required";
    if (!form.quantity.trim()) e.quantity = "Required";
    if (!form.destination.trim()) e.destination = "Required";
    if (!privacyConsent) e.privacyConsent = "Privacy-policy consent is required";
    return e;
  }

  function openWhatsApp() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const msg = buildWhatsAppMessage(form, category.shortTitle);
    window.open(waLink(siteConfig.whatsappRaw, msg), "_blank", "noopener,noreferrer");
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    const subject = `RFQ — ${category.shortTitle}: ${form.product}`;
    const body = buildEmailMessage(form, category.shortTitle);
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitting(false);
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* ── HERO ── */}
      <section className="cat-hero">
        <div className="container-site">
          <nav className="cat-breadcrumb" aria-label="Breadcrumb">
            <Link href="/products">Capabilities</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span>{category.shortTitle}</span>
          </nav>
          <div className="cat-hero-content">
            <span className="eyebrow">{category.shortTitle}</span>
            <h1 className="cat-hero-title">{category.title}</h1>
            <p className="cat-hero-desc">{category.longDescription}</p>
            <div className="inline-actions" style={{ marginTop: "2rem" }}>
              <button onClick={() => prefillAndScroll("")} className="btn btn-primary">
                Request a Quote <ArrowRight size={15} aria-hidden="true" />
              </button>
              <a
                href={waLink(siteConfig.whatsappRaw, `Hello Safar Traders, I would like to discuss a sourcing requirement for ${category.shortTitle}.`)}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <MessageCircle size={15} aria-hidden="true" /> WhatsApp requirement
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBCATEGORIES + SIDEBAR ── */}
      <section className="section-pad bg-white">
        <div className="container-site cat-page-grid">

          {/* LEFT: subcategory sections */}
          <div className="cat-subcats">
            <div className="cat-overview">
              <span className="eyebrow">Category overview</span>
              <h2 className="section-title small">{category.shortTitle} procurement support.</h2>
              <p>{category.description}</p>
              <p>{category.buyerIntent}</p>
            </div>

            {category.subcategories.map((sub, i) => (
              <article key={sub.slug} className="subcat-section">
                <div className="subcat-img-wrap">
                  {catalogImages[sub.slug] ? (
                    <Image
                      src={catalogImages[sub.slug]}
                      alt={`${sub.name} capability`}
                      fill
                      sizes="(min-width: 900px) 32vw, 100vw"
                      className="subcat-img"
                    />
                  ) : (
                    <div className="subcat-img-placeholder" aria-hidden="true">
                      <span>{sub.name[0]}</span>
                    </div>
                  )}
                </div>
                <div className="subcat-body">
                  <span className="subcat-index">0{i + 1}</span>
                  <h2 className="subcat-title">{sub.name}</h2>
                  <p className="subcat-desc">{sub.description}</p>
                  <div className="subcat-examples">
                    {sub.examples.map((ex) => (
                      <span key={ex} className="subcat-chip">{ex}</span>
                    ))}
                  </div>
                  {sub.rfqNote && (
                    <p className="subcat-rfq-note">
                      <strong>For your RFQ:</strong> {sub.rfqNote}
                    </p>
                  )}
                  <button
                    onClick={() => prefillAndScroll(sub.name)}
                    className="btn btn-secondary small-btn subcat-cta"
                  >
                    Request a Quote <ArrowRight size={13} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}

            {/* buyer note */}
            <div className="cat-buyer-note">
              <strong>Best fit:</strong> {category.buyerIntent}
            </div>
          </div>

          {/* RIGHT: sticky sidebar */}
          <aside className="cat-sidebar">
            <div className="cat-sidebar-sticky">
              <div className="sidebar-info-card">
                <div className="sidebar-card-head">
                  <PackageCheck size={16} aria-hidden="true" />
                  <span>Packing options</span>
                </div>
                <ul className="sidebar-list">
                  {category.packing.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
              <div className="sidebar-info-card">
                <div className="sidebar-card-head">
                  <FileText size={16} aria-hidden="true" />
                  <span>Documents</span>
                </div>
                <ul className="sidebar-list">
                  {category.documentation.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── RFQ FORM ── */}
      <section className="section-pad bg-light section-border" ref={formRef}>
        <div className="container-site">
          <div className="rfq-layout">
            <div className="rfq-intro">
              <span className="eyebrow">Request a Quote</span>
              <h2 className="section-title small">Submit your sourcing requirement.</h2>
              <p className="section-copy">
                Fill in your requirement details below. We review every RFQ against sourcing feasibility
                before responding. We aim to respond within one business day.
              </p>
              <div className="rfq-wa-note">
                <MessageCircle size={16} aria-hidden="true" />
                <span>You can also send the filled form directly on WhatsApp using the button below.</span>
              </div>
            </div>

            <div className="rfq-form-card">
              <form onSubmit={handleSubmit} noValidate className="rfq-form" aria-label="RFQ form">
                  <div className="rfq-row-2">
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-name">Contact person <span aria-hidden="true">*</span></label>
                      <input id="rfq-name" className={`form-input${errors.name ? " input-error" : ""}`} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-company">Company <span aria-hidden="true">*</span></label>
                      <input id="rfq-company" className={`form-input${errors.company ? " input-error" : ""}`} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company name" />
                      {errors.company && <span className="field-error">{errors.company}</span>}
                    </div>
                  </div>

                  <div className="rfq-row-2">
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-email">Email</label>
                      <input id="rfq-email" type="email" className="form-input" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" />
                    </div>
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-phone">Phone / WhatsApp <span aria-hidden="true">*</span></label>
                      <input id="rfq-phone" className={`form-input${errors.phone ? " input-error" : ""}`} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 234 567 8900" />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="rfq-row-2">
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-category">Category <span aria-hidden="true">*</span></label>
                      <input id="rfq-category" className="form-input" value={category.shortTitle} readOnly />
                    </div>
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-country">Country</label>
                      <select id="rfq-country" className="form-input" value={form.country} onChange={(e) => set("country", e.target.value)}>
                        <option value="">Select country</option>
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="rfq-row-2">
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-subcat">Subcategory</label>
                      <select id="rfq-subcat" className="form-input" value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)}>
                        <option value="">Select subcategory</option>
                        {category.subcategories.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="rfq-field">
                    <label className="form-label" htmlFor="rfq-product">Product / Requirement <span aria-hidden="true">*</span></label>
                    <input id="rfq-product" className={`form-input${errors.product ? " input-error" : ""}`} value={form.product} onChange={(e) => set("product", e.target.value)} placeholder="e.g. HR steel coil, HDPE granules, hydraulic press machine" />
                    {errors.product && <span className="field-error">{errors.product}</span>}
                  </div>
                  <div className="hidden-field" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
                  <label style={{ display: "flex", gap: "0.45rem", alignItems: "flex-start" }}><input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} /><span>I agree to the processing of my details under the <Link href={siteConfig.legal.privacyPolicyUrl}>Privacy Policy</Link>.</span></label>
                  {errors.privacyConsent && <span className="field-error">{errors.privacyConsent}</span>}

                  <div className="rfq-row-2">
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-grade">Grade / Specification</label>
                      <input id="rfq-grade" className="form-input" value={form.grade} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. IS 2062 E250, Grade A, MFI 2.0" />
                    </div>
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-qty">Quantity <span aria-hidden="true">*</span></label>
                      <input id="rfq-qty" className={`form-input${errors.quantity ? " input-error" : ""}`} value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="e.g. 25 MT, 1 x 40ft FCL" />
                      {errors.quantity && <span className="field-error">{errors.quantity}</span>}
                    </div>
                  </div>

                  <div className="rfq-row-2">
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-dest">Destination port / country <span aria-hidden="true">*</span></label>
                      <input id="rfq-dest" className={`form-input${errors.destination ? " input-error" : ""}`} value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Dubai, Colombo, Lagos" />
                      {errors.destination && <span className="field-error">{errors.destination}</span>}
                    </div>
                    <div className="rfq-field">
                      <label className="form-label" htmlFor="rfq-timeline">Timeline</label>
                      <input id="rfq-timeline" className="form-input" value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="e.g. Within 30 days, urgent" />
                    </div>
                  </div>

                  <div className="rfq-field">
                    <label className="form-label" htmlFor="rfq-notes">Notes</label>
                    <textarea id="rfq-notes" className="form-input rfq-textarea" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any additional details, Incoterms preference, packaging requirements, etc." />
                  </div>

                  <div className="rfq-actions">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? "Opening email…" : "Submit RFQ"}
                    </button>
                    <button type="button" onClick={openWhatsApp} className="btn btn-secondary">
                      <MessageCircle size={15} aria-hidden="true" /> Send RFQ on WhatsApp
                    </button>
                  </div>
                  {errors.submit && <p className="field-error form-submit-error">{errors.submit}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      <section className="section-pad-sm bg-white section-border">
        <div className="container-site">
          <div className="section-heading-row compact">
            <div>
              <span className="eyebrow">Related capabilities</span>
              <h2 className="section-title small">Other sourcing categories.</h2>
            </div>
            <Link href="/products" className="btn btn-secondary small-btn">All capabilities</Link>
          </div>
          <div className="related-grid">
            {otherCategories.map((item) => (
              <Link href={`/products/${item.slug}`} key={item.slug} className="related-card">
                <span>{item.shortTitle}</span>
                <strong>{item.title}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
