import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LeadCTA from "@/components/LeadCTA";
import RFQWizardLauncher from "@/components/RFQWizardLauncher";
import { siteConfig } from "@/lib/site-config";
import { waLink } from "@/lib/whatsapp";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  pathname: "/contact",
  title: "Request a Quote for Industrial Sourcing",
  description: "Submit an RFQ for swimming pool solutions, metals, scrap, machinery, industrial materials, packaging, or custom requirements with export support from India.",
});

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home" }, { name: "Request a Quote", pathname: "/contact" }]);

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow="Request a Quote"
        title="Send your sourcing requirement for review."
        description="Share product details, specification, quantity, destination, and timeline. The clearer the RFQ, the faster we can assess sourcing and export feasibility."
        breadcrumbs={[{ label: "Request a Quote" }]}
        cta={<RFQWizardLauncher label="Request a Quote" />}
      />
      <LeadCTA />

      <section className="section-pad-sm" style={{ backgroundColor: "var(--color-dark-bg)", borderTop: "1px solid var(--color-dark-border)" }}>
        <div className="container-site contact-info-grid">
          {[
            { label: "Location", value: `${siteConfig.address.city}, ${siteConfig.address.state}, ${siteConfig.address.country}` },
            { label: "Trade email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
            { label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phoneRaw}` },
            siteConfig.phoneSecondary ? { label: "Secondary phone", value: siteConfig.phoneSecondary, href: `tel:${siteConfig.phoneSecondaryRaw}` } : null,
            { label: "WhatsApp", value: siteConfig.whatsapp, href: waLink(siteConfig.whatsappRaw, "Hello Safar Traders, I'd like to discuss a sourcing requirement.") },
            { label: "Buyer note", value: "For accurate review, include specification, quantity, destination, and required timeline." },
          ].filter((item): item is NonNullable<typeof item> => item !== null).map(({ label, value, href }) => (
            <div key={label}>
              <p className="eyebrow">{label}</p>
              {href ? <a href={href} className="contact-dark-link">{value}</a> : <p className="contact-dark-text">{value}</p>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
