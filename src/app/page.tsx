import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ExportProcess from "@/components/ExportProcess";
import ProductCategories from "@/components/ProductCategories";
import WhyChooseUs from "@/components/WhyChooseUs";
import LeadCTA from "@/components/LeadCTA";
import ResourcesTeaser from "@/components/ResourcesTeaser";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  pathname: "",
  title: "Industrial Sourcing & Export Partner in India | Safar Traders",
  description: "Source industrial goods from India with Safar Traders. Buyer-led procurement, supplier coordination, export documentation, packing, and shipment support.",
});

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home" }]);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Hero />
      <ProductCategories />
      <ExportProcess />
      <WhyChooseUs />
      <ResourcesTeaser />
      <LeadCTA />
    </>
  );
}
