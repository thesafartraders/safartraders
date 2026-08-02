import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ExportProcess from "@/components/ExportProcess";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  pathname: "/export-process",
  title: "Export Process",
  description: "Follow Safar Traders' transparent, documented export process from RFQ review through delivery for industrial buyers.",
});

const faqs = [
  {
    q: "What are your minimum order quantities?",
    a: "Minimum quantities vary by product, specification, and shipment requirements. Share your requirement and we will confirm the practical order quantity.",
  },
  {
    q: "Which Incoterms do you offer?",
    a: "We typically offer FOB (Free on Board) from Indian ports. CIF and CFR may be possible depending on the requirement. Please specify your preferred Incoterms in your RFQ.",
  },
  {
    q: "What ports do you ship from?",
    a: "We ship from major Indian ports. The specific loading port depends on sourcing feasibility and routing. Your freight forwarder can advise on optimal routing.",
  },
  {
    q: "Can we arrange third-party inspection?",
    a: "Yes. We welcome pre-shipment inspection by SGS, Bureau Veritas, or your nominated inspector. Inspection costs are typically borne by the buyer. Please mention this in your RFQ.",
  },
  {
    q: "What payment terms do you accept?",
    a: "Payment terms depend on the requirement, order value, and agreed trade terms. The proforma invoice confirms the payment schedule, currency, and banking details before production or procurement begins.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
};

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home" }, { name: "Export Process", pathname: "/export-process" }]);

export default function ExportProcessPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow="Trade Process"
        title="Transparent from first requirement to final delivery."
        description="Every order follows the same documented process — so you always know where your requirement stands."
        breadcrumbs={[{ label: "Export Process" }]}
      />
      <ExportProcess />

      {/* FAQ */}
      <section style={{
        backgroundColor: "var(--color-bg-secondary)",
        paddingTop: "4rem",
        paddingBottom: "4rem",
        borderTop: "1px solid var(--color-border-light)",
      }}>
        <div className="container-site" style={{ maxWidth: "720px" }}>
          <span className="eyebrow" style={{ marginBottom: "2rem", display: "block" }}>Common questions</span>
          {faqs.map(({ q, a }) => (
            <div key={q} style={{
              paddingTop: "1.5rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid var(--color-border-light)",
            }}>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.625rem" }}>
                {q}
              </p>
              <p style={{ fontSize: "0.9375rem", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
