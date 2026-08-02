import { productCategories } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export type ChatLink = { href: string; label: string };
export type KnowledgeEntry = {
  id: string;
  keywords: string[];
  answer: string;
  followUp?: string[];
  link?: ChatLink;
  priority?: number;
};

const rfqFollowUp = ["What information should I include in an RFQ?", "Which Incoterms do you offer?"];

const fixedEntries: KnowledgeEntry[] = [
  {
    id: "commercial-policy",
    priority: 100,
    keywords: ["price", "cost", "quote", "quotation", "payment", "availability", "available", "delivery date", "lead time"],
    answer: "Pricing, availability, and delivery timing depend on the exact specification, quantity, packing, and destination. Please submit your requirement and our team will review it before issuing a formal commercial proposal.",
    followUp: ["How do I submit an RFQ?", "What information should I include?"],
    link: { href: "/contact", label: "Submit an RFQ" },
  },
  {
    id: "exclusions",
    priority: 100,
    keywords: ["food", "fresh", "produce", "perishable", "vegetable", "fruit"],
    answer: "Safar Traders handles non-perishable industrial and commercial goods. We do not deal in food, fresh produce, or other perishable products.",
  },
  {
    id: "company",
    keywords: ["who are you", "about safar", "contact", "email", "phone", "whatsapp", "where are you", "location", "based"],
    answer: `${siteConfig.name} is a trade and export partner for industrial and commercial goods. We are based in ${siteConfig.address.city}, ${siteConfig.address.state}, India. You can reach us at ${siteConfig.email} or ${siteConfig.phone}.`,
    followUp: ["What products do you source?", "How do I submit an RFQ?"],
    link: { href: "/contact", label: "Contact Safar Traders" },
  },
  {
    id: "rfq",
    keywords: ["rfq", "request a quote", "request quotation", "submit requirement", "how to order", "how do i order"],
    answer: "Send the product specification, quantity, destination country and port, packing preference, inspection requirement, and target timeline. Those details let us check supplier fit, export handling, and the commercial feasibility of your request.",
    followUp: rfqFollowUp,
    link: { href: "/resources/rfq-preparation", label: "RFQ preparation guide" },
  },
  {
    id: "moq",
    keywords: ["moq", "minimum order", "minimum quantity", "minimum qty", "minimum volume"],
    answer: "Minimum quantities vary by product, specification, and shipment requirements. Share your exact requirement and we will confirm the practical order quantity.",
    followUp: ["How do I submit an RFQ?", "Which Incoterms do you offer?"],
    link: { href: "/export-process", label: "View export process" },
  },
  {
    id: "incoterms",
    keywords: ["incoterm", "fob", "cif", "cfr", "trade terms"],
    answer: "We typically offer FOB from Indian ports. CIF and CFR may be possible depending on the requirement; please include your preferred Incoterm in the RFQ so we can review it.",
    followUp: ["Which ports do you ship from?", "How do I submit an RFQ?"],
    link: { href: "/resources/trade-terms", label: "Trade terms guide" },
  },
  {
    id: "shipping",
    keywords: ["ship", "shipping", "port", "country", "destination", "freight"],
    answer: "We ship from major Indian ports. The loading port and route depend on the product, sourcing location, destination, and freight feasibility, so please include your destination country and port in the RFQ.",
    followUp: ["Which Incoterms do you offer?", "How is packing handled?"],
    link: { href: "/export-process", label: "View export process" },
  },
  {
    id: "inspection",
    keywords: ["inspection", "sgs", "bureau veritas", "third party", "third-party", "quality check"],
    answer: "Yes. Pre-shipment inspection can be arranged through SGS, Bureau Veritas, or your nominated inspector. Please state the inspection requirement in the RFQ; inspection costs are typically borne by the buyer.",
    followUp: ["What documents do you provide?", "How do I submit an RFQ?"],
    link: { href: "/resources/pre-shipment-inspection", label: "Inspection guide" },
  },
  {
    id: "documentation",
    keywords: ["document", "bill of lading", "packing list", "certificate of origin", "invoice", "paperwork"],
    answer: "Typical export documents include the commercial invoice, packing list, bill of lading, certificate of origin when required, and inspection or test reports when applicable. The final document set depends on the product and destination country.",
    followUp: ["Can we arrange third-party inspection?", "How is packing handled?"],
    link: { href: "/resources/export-documentation", label: "Documentation guide" },
  },
  {
    id: "packing",
    keywords: ["packing", "packaging", "load", "loading", "pallet", "container"],
    answer: "Packing is planned around the product, handling risk, container utilisation, and destination conditions. Please share any packing preference in your RFQ so it can be considered before quotation.",
    followUp: ["What information should I include in an RFQ?", "What documents do you provide?"],
    link: { href: "/resources/packing-loading", label: "Packing and loading guide" },
  },
  {
    id: "process",
    keywords: ["process", "how does it work", "steps", "after rfq"],
    answer: "The process is requirement review, supplier fit and feasibility, formal quotation, order confirmation, inspection and loading, then shipping and documentation. We coordinate the sourcing and export process as a single point of contact.",
    followUp: rfqFollowUp,
    link: { href: "/export-process", label: "View full process" },
  },
  {
    id: "custom",
    keywords: ["custom source", "not listed", "special requirement", "find a supplier", "source something"],
    answer: "Yes. We can review buyer-led and non-standard sourcing requirements that fall within our non-perishable industrial and commercial scope. Send the specification, quantity, destination, and timeline for an initial feasibility review.",
    followUp: ["What information should I include in an RFQ?", "What products do you source?"],
    link: { href: "/resources/custom-sourcing-scope", label: "Custom sourcing guide" },
  },
];

const productEntries: KnowledgeEntry[] = productCategories.flatMap((category) => {
  const categoryEntry: KnowledgeEntry = {
    id: `category:${category.slug}`,
    keywords: [category.title, category.shortTitle, category.slug.replaceAll("-", " "), ...category.subcategories.flatMap((item) => [item.name, item.slug.replaceAll("-", " "), ...item.examples])],
    answer: `We source ${category.description} Examples include ${category.subcategories.slice(0, 5).map((item) => item.name).join(", ")}. Share your specification, quantity, destination, and timeline so we can review feasibility.`,
    followUp: ["How do I submit an RFQ?", "What are your minimum order quantities?"],
    link: { href: `/products/${category.slug}`, label: `Explore ${category.shortTitle}` },
  };
  const subcategoryEntries = category.subcategories.map((item) => ({
    id: `product:${item.slug}`,
    keywords: [item.name, item.slug.replaceAll("-", " "), ...item.examples],
    answer: `Yes, we can review sourcing requirements for ${item.name}. ${item.description} ${item.rfqNote}`,
    followUp: ["How do I submit an RFQ?", "What are your minimum order quantities?"],
    link: { href: `/products/${category.slug}`, label: `Explore ${category.shortTitle}` },
  }));
  return [categoryEntry, ...subcategoryEntries];
});

export const knowledgeEntries = [...fixedEntries, ...productEntries];
