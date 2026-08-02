import type { StaticImageData } from "next/image";
import customSourcingImage from "@/images/industrialsourcing.webp";
import documentationImage from "@/images/industrialmaterial.webp";
import inspectionImage from "@/images/construction.webp";
import packingImage from "@/images/packing.webp";
import tradeTermsImage from "@/images/metalandalloy.webp";
import sourcingScopeImage from "@/images/machine.webp";

export type ResourceSection = {
  heading: string;
  body: string[];
};

export type ResourceGuide = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  seoTitle: string;
  metaDescription: string;
  datePublished: string;
  dateModified: string;
  readTime: string;
  image: StaticImageData;
  imageAlt: string;
  relatedSlugs?: string[];
  links?: { label: string; href: string }[];
  intro: string[];
  sections: ResourceSection[];
  checklist: { heading: string; items: string[] };
  mistakes: { heading: string; items: string[] };
  why: string;
};

export const resourceGuides: ResourceGuide[] = [
  {
    slug: "rfq-preparation",
    category: "RFQ Preparation",
    title: "What to include in an industrial sourcing request",
    summary:
      "A useful RFQ gives the sourcing team enough information to check supplier fit, pricing feasibility, packing, and export handling before discussing commercial terms.",
    seoTitle: "How to Write an Industrial RFQ",
    metaDescription:
      "A complete guide to preparing an industrial RFQ — what details to include, why each one matters, and the most common mistakes that delay a quotation.",
    datePublished: "2026-07-10",
    dateModified: "2026-08-03",
    readTime: "6 min read",
    image: customSourcingImage,
    imageAlt: "Industrial sourcing and procurement planning",
    relatedSlugs: ["pre-shipment-inspection", "trade-terms", "custom-sourcing-scope"],
    links: [
      { label: "Plan your pre-shipment inspection", href: "/resources/pre-shipment-inspection" },
      { label: "Discuss your sourcing requirement", href: "/contact" },
    ],
    intro: [
      "Most delays in industrial sourcing don't happen during shipping or production — they happen before a quotation is even issued, because the original request didn't carry enough information to act on. An RFQ (Request for Quotation) is the starting point of the entire sourcing process, and the quality of that first message determines how quickly — and how accurately — a usable quotation can be prepared.",
      "This guide walks through what a complete industrial RFQ looks like, why each detail matters to the sourcing team on the other end, and where buyers most commonly lose time by leaving out information that seems minor but isn't.",
    ],
    sections: [
      {
        heading: "Why specification detail changes the outcome",
        body: [
          "A product name alone is rarely enough to source correctly. \"Stainless steel sheets\" could mean a dozen different grades, thicknesses, and finishes, each with a different supplier base and a different price point. When the grade or standard isn't specified, the sourcing team either has to guess — which risks quoting the wrong product — or send a clarification message back, which adds a full round trip before anything else can move forward.",
          "The fix is simple: include the technical description exactly as you'd specify it on a purchase order, even at RFQ stage. Grade, standard, dimensions, and application context all narrow the search immediately and let the team assess sourcing feasibility against your actual requirement instead of an assumption.",
        ],
      },
      {
        heading: "Quantity and frequency tell two different stories",
        body: [
          "Quantity alone tells a supplier how much material is needed. Frequency tells them whether this is a one-off trial order or the start of a recurring relationship — and that distinction affects pricing, supplier selection, and how much effort goes into building a long-term sourcing pipeline versus a single transaction.",
          "If you're testing a new supplier relationship with a smaller trial shipment before scaling up, say so. It changes how a quotation is framed and can open the door to better terms once volume increases.",
        ],
      },
      {
        heading: "Destination determines more than just freight",
        body: [
          "The destination country and port affect freight cost, but they also affect which Incoterms make sense, what documentation will be required for customs clearance, and in some cases — particularly for chemicals, scrap, or regulated materials — whether the shipment is even permitted into that market without additional certification.",
          "Providing the destination port (not just the country) early on lets the sourcing team check realistic freight rates and transit times instead of working from a rough estimate that may shift once the actual port is confirmed.",
        ],
      },
      {
        heading: "Packing preference is a cost decision, not a detail",
        body: [
          "Packing affects container utilization, handling risk, and total freight cost — sometimes significantly. A buyer who states a packing preference upfront (palletized vs loose, for example, or specific moisture protection for a humid destination) gets a quotation that already reflects the real shipping cost, rather than one that has to be revised once packing is discussed later in the process.",
        ],
      },
    ],
    checklist: {
      heading: "What to include in your RFQ",
      items: [
        "Product name or technical description",
        "Grade, standard, material type, or specification",
        "Required quantity and frequency",
        "Destination country and port",
        "Packing preference",
        "Inspection requirement",
        "Target timeline",
        "Incoterm preference if known",
      ],
    },
    mistakes: {
      heading: "Common mistakes that delay a quotation",
      items: [
        "Naming the product without grade, standard, or technical specification, leaving the sourcing team to guess.",
        "Leaving out the destination port and only naming the country, which prevents an accurate freight estimate.",
        "Requesting a price without mentioning quantity, since per-unit pricing usually depends on order volume.",
        "Omitting whether the order is a one-off trial or the start of recurring supply, which affects supplier selection.",
        "Assuming packing is a later-stage detail, when it materially changes landed cost.",
      ],
    },
    why: "Incomplete RFQs usually delay quotation because sourcing feasibility, packing, and logistics cannot be checked properly. A complete RFQ is the fastest path to an accurate, usable quotation.",
  },
  {
    slug: "export-documentation",
    category: "Export Documentation",
    title: "Documents buyers usually review before shipment",
    summary:
      "Documentation requirements depend on product type, destination country, and buyer import process. The required list should be confirmed before shipment planning.",
    seoTitle: "Export Documentation Checklist for Importers",
    metaDescription:
      "A practical checklist of export documents buyers review before shipment, including what each document does and why it matters for customs clearance.",
    datePublished: "2026-07-10",
    dateModified: "2026-08-03",
    readTime: "7 min read",
    image: documentationImage,
    imageAlt: "Industrial materials prepared for export documentation",
    relatedSlugs: ["packing-loading", "pre-shipment-inspection", "trade-terms"],
    links: [
      { label: "Confirm packing and loading details", href: "/resources/packing-loading" },
      { label: "Discuss your document requirements", href: "/contact" },
    ],
    intro: [
      "Export documentation exists for one practical reason: it lets customs authorities, banks, freight forwarders, and the buyer's own receiving team verify that a shipment is what it claims to be, in the quantity claimed, from the source claimed. Missing or inconsistent documents are one of the most common causes of clearance delay — not because the product itself is a problem, but because the paperwork doesn't match it cleanly.",
      "This guide explains the documents that come up most often in industrial export shipments, what each one actually does, and why the requirement list can change from one shipment to the next.",
    ],
    sections: [
      {
        heading: "The core documents and what each one proves",
        body: [
          "The commercial invoice is the legal record of the sale — it states what was sold, to whom, at what price, and under what terms. Customs authorities use it to assess duty, and banks use it to process payment under the agreed terms. Every figure on it needs to match the purchase order and the Packing List exactly; even small mismatches can trigger a clearance query.",
          "The Packing List complements the invoice by describing how the goods are physically packed — carton counts, weights, dimensions, and how the cargo is distributed across the shipment. Customs and freight handlers use it to verify that what's declared matches what's loaded, and it's often the first document checked during a physical inspection.",
          "The bill of lading (for sea freight) or airway bill (for air freight) is issued by the carrier and serves as both a receipt for the cargo and, in the case of an original bill of lading, a transferable document of title. Depending on the payment terms agreed, the buyer may need an original bill of lading released before taking possession of the goods at the destination port.",
        ],
      },
      {
        heading: "Certificates that depend on product and destination",
        body: [
          "A certificate of origin confirms which country the goods were manufactured or produced in, and is required by many destination countries to apply the correct duty rate — particularly where a trade agreement between the origin and destination country offers preferential tariffs. Not every shipment needs one, but for goods moving into countries with active trade agreements with India, it's worth checking early rather than at the last stage.",
          "Inspection reports and product test certificates apply when the buyer, the destination country's regulator, or the product category itself requires third-party verification — common for metals (mill test certificates), machinery (performance or safety certification), and chemicals (analysis certificates). These should be agreed before loading, since arranging inspection after the fact is far harder.",
        ],
      },
      {
        heading: "Why the list isn't the same for every shipment",
        body: [
          "Two shipments of the same product can have different documentation requirements if they're going to different countries, because each country's customs authority sets its own import rules. A buyer's own import process — set by their customs broker or internal compliance team — can add further requirements on top of what the destination country mandates.",
          "Rather than assuming a standard list applies, the most reliable approach is to confirm document requirements with your destination customs broker (or ask your sourcing partner to do so) before shipment planning begins, not after the goods are ready to load.",
        ],
      },
    ],
    checklist: {
      heading: "Documents to confirm before shipment",
      items: [
        "Commercial invoice",
        "Packing List",
        "Bill of lading or airway bill",
        "Certificate of origin",
        "Inspection report if required",
        "Product certificate or test report if applicable",
        "Photos or loading evidence when needed",
      ],
    },
    mistakes: {
      heading: "Common mistakes that cause clearance delays",
      items: [
        "Assuming the same document list applies regardless of destination country.",
        "Letting invoice figures drift slightly from the Packing List or purchase order.",
        "Requesting a certificate of origin after the goods have already shipped.",
        "Not confirming who is responsible for arranging and paying for inspection.",
        "Treating documentation as a final-stage task instead of planning it alongside the order.",
      ],
    },
    why: "Clear document expectations reduce clearance delays and avoid last-minute shipment disputes. Confirming the requirement list early is far cheaper than resolving a documentation gap after the container has sailed.",
  },
  {
    slug: "pre-shipment-inspection",
    category: "Pre-Shipment Inspection",
    title: "How verification supports procurement teams",
    summary:
      "Inspection scope should be agreed before loading. For many industrial orders, inspection can include product condition, quantity, packing, marking, and loading checks.",
    seoTitle: "Pre-Shipment Inspection Guide for Buyers",
    metaDescription:
      "How pre-shipment inspection works for industrial orders — what gets checked, who can carry it out, and how to agree inspection scope before loading.",
    datePublished: "2026-07-10",
    dateModified: "2026-08-03",
    readTime: "5 min read",
    image: inspectionImage,
    imageAlt: "Industrial construction materials ready for inspection",
    relatedSlugs: ["rfq-preparation", "packing-loading", "export-documentation"],
    links: [
      { label: "Prepare a complete sourcing request", href: "/resources/rfq-preparation" },
      { label: "Discuss an inspection requirement", href: "/contact" },
    ],
    intro: [
      "Pre-shipment inspection is the verification step that happens after production but before the container is sealed — confirming that what's about to ship actually matches what was agreed. For buyers who haven't visited the supplier's facility, or who are sourcing at a distance, it's the single most effective way to catch a problem while it's still cheap and fast to fix.",
      "The value of inspection comes entirely from agreeing its scope upfront. An inspection that's arranged after loading has already started, or with no clear checklist, tends to confirm very little.",
    ],
    sections: [
      {
        heading: "What inspection actually checks",
        body: [
          "Most industrial pre-shipment inspections cover four areas: product condition (does it match the agreed specification, visually and dimensionally), quantity (does the counted or weighed amount match what's invoiced), packing and labeling (is it packed as agreed and marked correctly for the destination), and loading (is the container loaded safely and does the loading photo or video evidence the condition at the point of sealing).",
          "Depending on the product, inspection can go further — sampling for chemical composition, mechanical testing for metals, or functional testing for machinery. These deeper checks usually need to be specified at the RFQ or order-confirmation stage, since they require planning rather than a same-day visual check.",
        ],
      },
      {
        heading: "First-party, second-party, and third-party inspection",
        body: [
          "Inspection carried out by the supplier's own team is useful but carries an inherent conflict of interest — they're checking their own output. Inspection carried out by the buyer's sourcing partner (a second-party inspection) adds independence, since the sourcing partner's relationship is with the buyer, not the manufacturer.",
          "For higher-value or higher-risk shipments, an independent third-party inspection agency can be engaged. This adds cost and lead time but provides a fully independent report that carries more weight in the event of a dispute. Whether this is necessary depends on order value, product risk, and the buyer's internal compliance requirements.",
        ],
      },
      {
        heading: "Timing: agree before, not after",
        body: [
          "Inspection scope, responsibility, and cost should be agreed at the same time as the order — not raised once production is already underway. Trying to add an inspection requirement late often means the supplier has already prepared the goods for loading, and any non-conformance found at that stage is far more expensive and time-consuming to resolve than catching it earlier in production.",
        ],
      },
    ],
    checklist: {
      heading: "What to confirm before inspection",
      items: [
        "Inspection type required",
        "Quantity or sampling method",
        "Product condition checks",
        "Packing and labeling checks",
        "Loading photos or videos",
        "Third-party inspection request if needed",
      ],
    },
    mistakes: {
      heading: "Common mistakes that reduce inspection value",
      items: [
        "Agreeing to inspection in principle but never defining what's actually being checked.",
        "Requesting inspection only after the supplier has already begun loading.",
        "Relying solely on the supplier's own quality report with no independent check.",
        "Skipping loading evidence, which is often the simplest and most useful check to include.",
        "Not deciding in advance who bears the cost if inspection finds a non-conformance.",
      ],
    },
    why: "Inspection protects both buyer and supplier by confirming that agreed requirements are checked before shipment — turning a potential dispute after delivery into a fixable issue before the container leaves.",
  },
  {
    slug: "packing-loading",
    category: "Packing & Loading",
    title: "Packing details buyers should confirm early",
    summary:
      "Packing affects freight cost, handling safety, container use, and customs documentation. It should be discussed before final quotation whenever possible.",
    seoTitle: "Export Packing Guide for Industrial Shipments",
    metaDescription:
      "How packing choices affect freight cost, container utilization, and shipment safety — and what details to confirm before a quotation is finalized.",
    datePublished: "2026-07-10",
    dateModified: "2026-08-03",
    readTime: "5 min read",
    image: packingImage,
    imageAlt: "Packed industrial goods ready for shipment",
    relatedSlugs: ["export-documentation", "pre-shipment-inspection", "trade-terms"],
    links: [
      { label: "Review export documentation", href: "/resources/export-documentation" },
      { label: "Discuss packing for your shipment", href: "/contact" },
    ],
    intro: [
      "Packing is sometimes treated as an operational detail to be sorted out after pricing is agreed. In practice, packing method is one of the biggest variables behind the final landed cost of an industrial shipment — it affects how efficiently a container is used, how much handling risk the cargo carries, and what documentation is needed at customs. Getting it agreed early avoids re-quoting later.",
    ],
    sections: [
      {
        heading: "Packing method changes how much you're really shipping",
        body: [
          "Loose or bulk-loaded cargo can sometimes fit more product into a container by volume, but it carries higher handling risk and can complicate customs verification, since loose cargo is harder to count and inspect precisely. Palletized or bundled cargo is typically easier to handle and count but uses container space less efficiently, which can mean more containers — and more freight cost — for the same order quantity.",
          "There's rarely a single right answer; the right packing method depends on the product, the destination's handling infrastructure, and how price-sensitive freight is for that particular order. What matters is deciding deliberately rather than defaulting to whatever the supplier normally does.",
        ],
      },
      {
        heading: "Container type and load planning",
        body: [
          "Standard 20 ft and 40 ft containers suit most general cargo, but heavier or denser materials (certain metals, stone, machinery) may hit weight limits before they fill the available volume — meaning a 40 ft container might not be the most economical choice even though it looks like more space. For oversized or irregular cargo, flat-rack or break-bulk shipping may be required instead of standard containerization.",
          "LCL (less than container load) shipping lets a buyer order smaller quantities without paying for a full container, but it usually costs more per unit and takes longer in transit, since LCL cargo is consolidated with other shipments at origin and deconsolidated at destination.",
        ],
      },
      {
        heading: "Labeling, moisture protection, and destination handling",
        body: [
          "Labeling and marking requirements vary by destination and sometimes by product category — some countries require specific language, hazard marking, or country-of-origin marking directly on packaging. Moisture protection matters more than buyers often expect, particularly for sea freight to humid climates or long transit routes, where condensation inside a container can damage unprotected cargo even without any external water exposure.",
          "Destination handling capability is also worth checking — a port or inland destination without heavy-lift equipment may struggle with packing formats that assume mechanized handling, leading to delays or additional local handling charges.",
        ],
      },
    ],
    checklist: {
      heading: "Packing details to confirm before quotation",
      items: [
        "Packing method: loose, bundled, palletized, crated, bagged, or boxed",
        "Container type: 20 ft, 40 ft, LCL, FCL, or break-bulk",
        "Labeling or marking requirements",
        "Moisture protection or wrapping",
        "Loading supervision requirement",
        "Destination handling limitations",
      ],
    },
    mistakes: {
      heading: "Common mistakes that increase shipping cost",
      items: [
        "Assuming the supplier's default packing method is the most cost-effective for your shipment.",
        "Choosing a 40 ft container by default without checking against weight limits for dense cargo.",
        "Skipping moisture protection for long sea transits to humid destinations.",
        "Not confirming destination labeling requirements until the goods are already packed.",
        "Leaving loading supervision unconfirmed, then discovering no photos or videos were taken.",
      ],
    },
    why: "Wrong packing assumptions can change total cost, shipment safety, and delivery timelines — and re-packing after the fact is far more expensive than agreeing the method before quotation.",
  },
  {
    slug: "trade-terms",
    category: "Trade Terms",
    title: "Commercial terms to clarify before quotation",
    summary:
      "Before a formal quotation, the buyer and sourcing team should align on basic trade terms so pricing can be prepared accurately.",
    seoTitle: "Incoterms & Trade Terms Explained for Buyers",
    metaDescription:
      "A buyer-focused explanation of Incoterms, payment terms, and the commercial details that turn a rough price into an accurate, usable quotation.",
    datePublished: "2026-07-10",
    dateModified: "2026-08-03",
    readTime: "6 min read",
    image: tradeTermsImage,
    imageAlt: "Industrial metal materials for international trade",
    relatedSlugs: ["rfq-preparation", "packing-loading", "export-documentation"],
    links: [
      { label: "Include commercial details in your RFQ", href: "/resources/rfq-preparation" },
      { label: "Discuss quotation terms", href: "/contact" },
    ],
    intro: [
      "A price quoted without trade terms attached isn't really a complete quotation — it's a starting figure. Two suppliers quoting the same per-unit price under different Incoterms can mean very different total costs once freight, insurance, and risk responsibility are factored in. This guide explains the commercial terms worth clarifying before treating any quotation as comparable or final.",
    ],
    sections: [
      {
        heading: "Incoterms determine who pays for what, and when risk transfers",
        body: [
          "Incoterms (International Commercial Terms) are a standardized set of trade terms that define exactly where the seller's responsibility ends and the buyer's begins — covering transport cost, insurance, customs clearance, and the point at which risk of loss or damage transfers from seller to buyer.",
          "EXW (Ex Works) places almost all responsibility on the buyer from the seller's premises onward — the buyer arranges and pays for everything from pickup to final delivery. FOB (Free on Board) shifts responsibility to the buyer once goods are loaded onto the vessel at the origin port, meaning the seller handles inland transport and export clearance, but the buyer arranges and pays for ocean freight. CIF (Cost, Insurance, and Freight) goes further — the seller arranges and pays for freight and insurance to the destination port, though risk technically transfers once goods are loaded, similar to FOB. CFR (Cost and Freight) is the same as CIF but without seller-arranged insurance.",
          "None of these is universally \"better\" — the right choice depends on whether the buyer has their own freight forwarding relationships and wants control over shipping, or would rather have the seller manage logistics end-to-end for a single landed price.",
        ],
      },
      {
        heading: "Currency, payment terms, and validity period",
        body: [
          "Currency matters because exchange rate movement between quotation and payment can shift the real cost of an order, particularly for longer production lead times. Agreeing currency upfront avoids ambiguity about which exchange rate applies if there's a gap between quotation and invoice.",
          "Payment terms — advance payment, payment against documents, letter of credit, or open account — affect both risk and cash flow for both sides, and should be discussed before a quotation is finalized rather than assumed. A quotation's validity period also matters: raw material and freight costs can shift, so a quotation that doesn't specify how long it remains valid leaves both sides exposed to repricing disputes if there's a delay between quotation and order confirmation.",
        ],
      },
      {
        heading: "Freight inclusion and inspection responsibility",
        body: [
          "Whether freight is included in the quoted price changes how directly comparable two quotations are — a lower per-unit price with freight excluded may end up costing more once freight is added than a higher price that already includes it. Similarly, deciding who is responsible for, and who pays for, any pre-shipment inspection should be settled before quotation, since it's a real cost that needs to sit somewhere in the commercial terms.",
        ],
      },
    ],
    checklist: {
      heading: "Trade terms to clarify before quotation",
      items: [
        "Incoterm preference such as FOB, CIF, CFR, or EXW",
        "Currency",
        "Payment terms expectation",
        "Destination port",
        "Validity period needed",
        "Inspection responsibility",
        "Freight inclusion or exclusion",
      ],
    },
    mistakes: {
      heading: "Common mistakes when comparing quotations",
      items: [
        "Comparing prices quoted under different Incoterms as if they were directly comparable.",
        "Not confirming currency, then disputing the applicable exchange rate later.",
        "Treating a quotation as open-ended when it actually carries a validity period.",
        "Assuming freight is included without checking explicitly.",
        "Leaving inspection cost responsibility undecided until after the order is confirmed.",
      ],
    },
    why: "A price without trade terms is incomplete. Terms affect risk, freight, insurance, documentation, and responsibility — and clarifying them early is what makes a quotation genuinely comparable and actionable.",
  },
  {
    slug: "custom-sourcing-scope",
    category: "Sourcing Scope",
    title: "How to define a custom sourcing requirement",
    summary:
      "For custom or non-standard industrial requirements, the buyer should describe the application and acceptable alternatives, not only the product name.",
    seoTitle: "Defining a Custom Sourcing Requirement",
    metaDescription:
      "How to scope a custom or non-standard industrial sourcing requirement so it can be matched to the right supplier quickly and accurately.",
    datePublished: "2026-07-10",
    dateModified: "2026-08-03",
    readTime: "5 min read",
    image: sourcingScopeImage,
    imageAlt: "Industrial machinery for a custom sourcing requirement",
    relatedSlugs: ["rfq-preparation", "trade-terms", "pre-shipment-inspection"],
    links: [
      { label: "Prepare a complete sourcing request", href: "/resources/rfq-preparation" },
      { label: "Discuss your custom requirement", href: "/contact" },
    ],
    intro: [
      "Standard products are relatively easy to source — the specification is well known and the supplier base is established. Custom or non-standard requirements are different: the product name alone often isn't enough to identify a suitable supplier, because the requirement sits outside a typical catalogue listing. Defining scope properly upfront is what makes the difference between a fast, accurate sourcing response and a long back-and-forth.",
    ],
    sections: [
      {
        heading: "Describe the application, not just the product",
        body: [
          "Two buyers asking for what sounds like the same material can have very different actual requirements depending on what it's being used for. A sourcing team that understands the application — what the product needs to withstand, what environment it operates in, what it connects to or replaces — can identify suitable alternatives even when an exact match isn't readily available, and can flag early if a requested specification is likely to be difficult or costly to source.",
          "Application context is especially valuable for engineering components, custom-manufactured parts, and speciality materials, where the same functional requirement can sometimes be met by more than one material or grade.",
        ],
      },
      {
        heading: "Technical drawings and acceptable alternatives",
        body: [
          "For manufactured parts, a drawing or sample is worth more than a written description — it removes ambiguity about dimensions, tolerances, and finish that's hard to capture precisely in words. If a drawing isn't available, photos, reference part numbers, or a sample from a previous supplier can serve a similar purpose.",
          "Stating which alternatives are acceptable (a different but equivalent grade, an alternative finish, a tolerance range rather than an exact figure) gives the sourcing team room to find a workable match faster, rather than ruling out a viable supplier over a difference that may not actually matter for the application.",
        ],
      },
      {
        heading: "Certification, quantity range, and timeline",
        body: [
          "If a specific certification or standard is required (an industry standard, a regulatory certificate, a quality system requirement), state it explicitly — sourcing without this information can lead to quoting a supplier that turns out not to be qualified once certification is checked.",
          "A minimum and target quantity, rather than a single fixed number, helps the sourcing team understand pricing tiers and supplier minimum order quantities. Mentioning whether the order is likely to repeat also matters: a one-off custom requirement and a custom requirement with repeat order potential are sourced differently, since the latter justifies more upfront supplier-qualification effort.",
        ],
      },
    ],
    checklist: {
      heading: "Details to define a custom requirement",
      items: [
        "Product application",
        "Technical drawings or photos if available",
        "Acceptable material alternatives",
        "Required certification or standard",
        "Minimum and target quantity",
        "Country restrictions if any",
        "Timeline and repeat order potential",
      ],
    },
    mistakes: {
      heading: "Common mistakes when scoping custom requirements",
      items: [
        "Naming only the product, with no application context for a non-standard requirement.",
        "Withholding a drawing or sample that already exists, slowing down supplier matching.",
        "Ruling out alternatives upfront without checking whether they'd actually meet the application.",
        "Leaving certification requirements unstated until after a supplier has already been shortlisted.",
        "Not mentioning repeat order potential, which can affect which suppliers are worth qualifying.",
      ],
    },
    why: "Clear sourcing scope helps identify suitable suppliers faster and avoids quoting the wrong product — particularly important for requirements that don't fit neatly into a standard catalogue listing.",
  },
];

export function getResourceGuide(slug: string) {
  return resourceGuides.find((g) => g.slug === slug);
}
