import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RFQWizardLauncher from "@/components/RFQWizardLauncher";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  pathname: "/about",
  title: "About Safar Traders — Trade & Export Partner",
  description: "Meet Safar Traders, a trade and export partner for buyers needing reliable industrial and commercial sourcing support from India.",
});

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home" }, { name: "About", pathname: "/about" }]);

const values = [
  {
    label: "Specification-first",
    detail: "Every order starts with a clear requirement. We source against your specification and do not ship material that does not meet agreed criteria.",
  },
  {
    label: "Document-complete",
    detail: "A shipment is not closed until every document is in order — BL, invoice, Packing List, COO, and any required inspection certificates.",
  },
  {
    label: "Buyer-responsive",
    detail: "We maintain a single point of contact per order. Questions get answered. Loading photos get sent. Updates happen before you need to ask.",
  },
  {
    label: "Compliance-aware",
    detail: "We operate within applicable export regulations and destination-country import rules as standard practice — no shortcuts, no surprises.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow="About Us"
        title="Built around a single idea: one partner, one process."
        description="Safar Traders is a procurement and export partner for buyers who need sourcing coordination, documentation support, and supply handling across multiple product categories."
        breadcrumbs={[{ label: "About" }]}
      />

      {/* Mission */}
      <section style={{
        backgroundColor: "var(--color-bg)",
        paddingTop: "4rem",
        paddingBottom: "4rem",
        borderBottom: "1px solid var(--color-border-light)",
      }}>
        <div className="container-site">
          <div className="about-2col">
            <div>
              <span className="eyebrow" style={{ marginBottom: "0.75rem", display: "block" }}>What we do</span>
              <h2 style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                lineHeight: 1.2,
              }}>
                Sourcing, procurement, documentation — one place.
              </h2>
            </div>
            <div>
              <p style={{ fontSize: "1rem", color: "var(--color-text-secondary)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                Buyers should not have to manage multiple suppliers, documentation partners, and
                shipment coordination separately. Safar Traders brings sourcing, procurement
                coordination, documentation support, and supply handling into one clear commercial process.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                Our scope covers non-perishable industrial and commercial goods — metals, machinery,
                industrial materials, and custom requirements. Each requirement is reviewed for supplier
                fit, specification, packing, and documentation before a quotation is issued.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{
        backgroundColor: "var(--color-bg-secondary)",
        paddingTop: "4rem",
        paddingBottom: "4rem",
        borderBottom: "1px solid var(--color-border-light)",
      }}>
        <div className="container-site">
          <span className="eyebrow" style={{ marginBottom: "2rem", display: "block" }}>How we operate</span>
          <div className="about-values-grid">
            {values.map((v) => (
              <div key={v.label} style={{
                padding: "1.5rem",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border-light)",
                borderRadius: "var(--radius-md)",
              }}>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.625rem" }}>
                  {v.label}
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                  {v.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        backgroundColor: "var(--color-dark-bg)",
        paddingTop: "4rem",
        paddingBottom: "4.5rem",
        textAlign: "center",
      }}>
        <div className="container-site" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-dark-text)",
            marginBottom: "1rem",
          }}>
            Have a sourcing requirement?
          </h2>
          <p style={{ color: "var(--color-dark-muted)", marginBottom: "2rem", fontSize: "1rem", lineHeight: 1.7 }}>
            Send your product requirement, quantity, destination, timeline, and specification so we can review sourcing feasibility.
          </p>
          <RFQWizardLauncher label="Request a Quote" className="btn btn-primary" />
        </div>
      </section>

      <style>{`
        .about-2col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 900px) {
          .about-2col { grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: start; }
        }
        .about-values-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .about-values-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </>
  );
}
