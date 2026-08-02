import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import WhyChooseUs from "@/components/WhyChooseUs";
import LeadCTA from "@/components/LeadCTA";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  pathname: "/why-us",
  title: "Why Choose Safar Traders for Export Sourcing",
  description: "See why buyers choose Safar Traders for procurement coordination, export documentation, and supplier coordination from India.",
});

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home" }, { name: "Why Choose Us", pathname: "/why-us" }]);

export default function WhyUsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow="Why Choose Us"
        title="One partner. Clear process. Reliable coordination."
        description="Buyers working across multiple supplier relationships, documentation requirements, and shipment timelines need a single point of coordination. Here is how we provide it."
        breadcrumbs={[{ label: "Why Choose Us" }]}
      />
      <WhyChooseUs showHeader={false} />
      <LeadCTA />
    </>
  );
}
