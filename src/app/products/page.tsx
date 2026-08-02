import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProductsGrid from "@/components/ProductsGrid";
import LeadCTA from "@/components/LeadCTA";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  pathname: "/products",
  title: "Industrial Sourcing Capabilities",
  description: "Explore industrial sourcing from India for pool equipment, metals, scrap, machinery, building materials, components, packaging, and custom RFQs.",
});

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home" }, { name: "Capabilities", pathname: "/products" }]);

export default function ProductsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow="Capabilities"
        title="We work from your requirement, not a catalogue."
        description="We work from your requirement, not a catalogue. Submit a specification and we coordinate supplier identification, quotation, documentation, and supply handling."
        breadcrumbs={[{ label: "Capabilities" }]}
      />

      <section style={{ backgroundColor: "var(--color-bg)", paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div className="container-site">
          <ProductsGrid />
        </div>
      </section>
      <LeadCTA />
    </>
  );
}
