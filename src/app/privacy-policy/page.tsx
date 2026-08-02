import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, shares, and protects personal information.`,
  alternates: { canonical: `${siteConfig.url}${siteConfig.legal.privacyPolicyUrl}` },
};

const updated = "August 3, 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section style={{ marginTop: "2.25rem" }}><h2 style={{ fontSize: "1.3rem", marginBottom: "0.65rem" }}>{title}</h2><div style={{ color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{children}</div></section>;
}

export default function PrivacyPolicyPage() {
  return <>
    <PageHero eyebrow="Legal" title="Privacy Policy" description={`Last updated ${updated}.`} breadcrumbs={[{ label: "Privacy Policy" }]} />
    <article className="container-site" style={{ maxWidth: "880px", paddingTop: "3.5rem", paddingBottom: "4.5rem" }}>
      <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.75 }}>This policy explains how {siteConfig.legal.entityName} (&ldquo;Safar Traders&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information submitted through this website. We are based in {siteConfig.address.city}, {siteConfig.address.state}, {siteConfig.address.country}. For privacy questions or complaints, email <a href={`mailto:${siteConfig.legal.grievanceEmail}`}>{siteConfig.legal.grievanceEmail}</a>.</p>
      <Section title="Information we collect"><p>We collect contact and business details such as your name, company, email address, telephone or WhatsApp number, country and address. We also collect requirement details such as products, specifications, quantities, destination, trade preferences, and messages. Our services may process IP-address-derived identifiers for rate limiting and security.</p></Section>
      <Section title="How we collect and use it"><p>We collect information when you use the RFQ wizard, contact form, chat widget, email, phone, or WhatsApp. We use it to respond to enquiries, assess sourcing feasibility, prepare quotations and RFQ summaries, coordinate services or orders, prevent abuse, and meet legal obligations. RFQs are not binding orders.</p></Section>
      <Section title="Legal grounds"><p>Where applicable, we process information with your consent, to take steps requested before entering a contract or to perform a contract, to meet legal obligations, and for legitimate interests such as protecting our website and responding to business enquiries. You may withdraw consent at any time; this does not affect processing already carried out.</p></Section>
      <Section title="Sharing and international transfers"><p>We use service providers to operate the site and handle enquiries. This may include our hosting provider, SMTP/email provider, Meta WhatsApp Cloud API when you select WhatsApp delivery, and OpenRouter, which processes chat messages to generate chat replies. These providers may process information outside your country. Do not send sensitive personal, payment, or confidential information through the chat.</p></Section>
      <Section title="Retention and security"><p>We retain enquiry and RFQ records for up to 24 months after the last meaningful interaction, unless a longer period is required for an order, legal claim, accounting, or compliance purpose. We use reasonable technical and organisational safeguards, including encrypted transport where supported and restricted access. No transmission or storage method is completely secure.</p></Section>
      <Section title="Your choices and rights"><p>Depending on applicable law, you may request access, correction, deletion, restriction, objection, portability, or withdrawal of consent. To make a request, email <a href={`mailto:${siteConfig.legal.grievanceEmail}`}>{siteConfig.legal.grievanceEmail}</a> with enough detail to identify the enquiry. You may also complain to the relevant data-protection authority.</p></Section>
      <Section title="Cookies and children"><p>This site does not use advertising, analytics, or tracking cookies. It is intended for business users and is not directed to children. Do not submit a child&apos;s personal information to us.</p></Section>
      <Section title="Changes to this policy"><p>We may update this policy when our practices or legal requirements change. The current version will be posted on this page with a revised date. Our <Link href={siteConfig.legal.termsUrl}>Terms &amp; Conditions</Link> also apply to use of this website.</p></Section>
    </article>
  </>;
}
