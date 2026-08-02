import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ResourcesGrid from "@/components/ResourcesGrid";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  pathname: "/resources",
  title: "Buyer Resources for Industrial Importers",
  description: "Practical guides for industrial importers on RFQs, export documents, inspection, packing, Incoterms, and custom sourcing from India.",
});

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home" }, { name: "Resources", pathname: "/resources" }]);

export default function ResourcesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow="Buyer resources"
        title="Practical notes for procurement teams."
        description="Short, buyer-focused guidance on RFQ preparation, documentation, inspection, packing, and export coordination."
        breadcrumbs={[{ label: "Resources" }]}
      />
      <section className="section-pad bg-white">
        <div className="container-site"><ResourcesGrid /></div>
      </section>
    </>
  );
}
