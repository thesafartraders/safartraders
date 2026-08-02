import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms for use of the ${siteConfig.name} website and trade requirement services.`,
  alternates: { canonical: `${siteConfig.url}${siteConfig.legal.termsUrl}` },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section style={{ marginTop: "2.25rem" }}><h2 style={{ fontSize: "1.3rem", marginBottom: "0.65rem" }}>{title}</h2><div style={{ color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{children}</div></section>;
}

export default function TermsPage() {
  return <>
    <PageHero eyebrow="Legal" title="Terms & Conditions" description="Last updated August 3, 2026." breadcrumbs={[{ label: "Terms & Conditions" }]} />
    <article className="container-site" style={{ maxWidth: "880px", paddingTop: "3.5rem", paddingBottom: "4.5rem" }}>
      <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.75 }}>These terms govern use of this website and trade requirements submitted to {siteConfig.legal.entityName} (&ldquo;Safar Traders&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site or submitting a requirement, you accept them.</p>
      <Section title="Our services and your use"><p>We provide sourcing coordination, procurement support, documentation support, export coordination, and supply handling for non-perishable industrial and commercial goods. You must provide accurate information, use the site lawfully, and not interfere with its operation or submit unlawful, infringing, or harmful material.</p></Section>
      <Section title="RFQs, quotations, and orders"><p>An RFQ, chat, email, or website submission is an invitation for us to review your requirement; it is not an offer, acceptance, reservation of stock, or binding agreement. A quotation is valid only for the period and on the written terms stated in it. Pricing, availability, specifications, lead times, Incoterms (including EXW, FOB, CFR, or CIF), payment, and delivery obligations are binding only when confirmed in a written commercial agreement or accepted purchase order.</p></Section>
      <Section title="Payment and export compliance"><p>Payment methods, including LC at sight or TT with advance where applicable, are subject to written agreement. Buyers are responsible for import permissions, duties, taxes, destination-country requirements, end use, sanctions screening, and all required approvals. Each party must comply with applicable export-control, anti-bribery, customs, and trade-sanctions laws.</p></Section>
      <Section title="Disclaimers and liability"><p>We do not guarantee sourcing success, supplier availability, pricing, quality, delivery dates, or suitability for a particular purpose unless expressly agreed in writing. To the maximum extent permitted by law, we are not liable for indirect, incidental, special, consequential, or lost-profit damages arising from site use or a requirement. Nothing excludes liability that cannot legally be excluded.</p></Section>
      <Section title="Intellectual property and third parties"><p>The site&apos;s content, branding, and materials are owned by or licensed to us and may not be copied or used without permission. Links to third-party services such as WhatsApp or LinkedIn are provided for convenience; their own terms and privacy practices apply.</p></Section>
      <Section title="Force majeure, changes, and severability"><p>We are not responsible for delay or failure caused by events beyond reasonable control, including government action, transport disruption, natural disaster, labour dispute, or supplier failure. We may update these terms by posting a revised version. If a provision is unenforceable, the remaining terms continue in effect.</p></Section>
      <Section title="Governing law and contact"><p>These terms are governed by the laws of India. Courts in Chennai, Tamil Nadu have exclusive jurisdiction, subject to mandatory law. Before commencing proceedings, the parties should attempt good-faith resolution by emailing <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. See also our <Link href={siteConfig.legal.privacyPolicyUrl}>Privacy Policy</Link>.</p></Section>
    </article>
  </>;
}
