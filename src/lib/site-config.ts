export const siteConfig = {
  name: "Safar Traders",
  tagline: "Trade & Export Partner",
  description:
    "Safar Traders is a trade and export partner for buyers sourcing swimming pool solutions, metals, scrap, machinery, construction materials, industrial raw materials, engineering components, packaging, and custom requirements from India.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://safartraders.com",
  lastModified: "2026-08-03",
  ogImage: "/og-image.jpg",
  phone: "+91 63813 72810",
  phoneRaw: "+916381372810",
  // Optional second contact number. Leave undefined to hide it everywhere it's used.
  phoneSecondary: undefined as string | undefined,
  phoneSecondaryRaw: undefined as string | undefined,
  whatsapp: "+91 63813 72810",
  whatsappRaw: "916381372810",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "safartradersofficials@gmail.com",
  legal: {
    privacyPolicyUrl: "/privacy-policy",
    termsUrl: "/terms-and-conditions",
    // Configure these from verified business records before publishing them.
    entityName: process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME || "Safar Traders",
    grievanceEmail: process.env.NEXT_PUBLIC_GRIEVANCE_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "safartradersofficials@gmail.com",
  },
  address: {
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
  },
  nav: [
    { label: "Capabilities", href: "/products" },
    { label: "Export Process", href: "/export-process" },
    { label: "Why Us", href: "/why-us" },
    { label: "Resources", href: "/resources" },
    { label: "Company Profile", href: "/company-profile" },
    { label: "Contact", href: "/contact" },
  ],
};
