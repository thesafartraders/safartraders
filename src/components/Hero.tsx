"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, Globe2, SearchCheck } from "lucide-react";
import RFQWizardLauncher from "@/components/RFQWizardLauncher";
import CompanyProfileTeaser from "@/components/CompanyProfileTeaser";
import { siteConfig } from "@/lib/site-config";
import { waLink } from "@/lib/whatsapp";

const proofItems = [
  { icon: SearchCheck, title: "Requirement-led sourcing", text: "Every order starts with a confirmed requirement — specification, quantity, destination, and trade terms." },
  { icon: FileText, title: "Documentation support", text: "Bill of Lading, Certificate of Origin, Packing List, and all clearance documents coordinated end to end." },
  { icon: Globe2, title: "Local and export supply", text: "We handle requirements for domestic buyers as well as international importers and procurement teams." },
];

export default function Hero() {
  return (
    <section className="hero-section">
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-background-image"
      />
      <CompanyProfileTeaser />
      <div className="container-site">

        <div className="hero-layout">
          <div className="hero-content">

            <div className="hero-tag">
              <span className="tag tag-accent">Trade &amp; Export Partner</span>
            </div>

            <h1 className="hero-title hero-title-brand">
              <span className="hero-brand-name">Safar Traders</span>
              <span className="hero-brand-sub">R&amp;D-led sourcing for trade and export requirements.</span>
            </h1>

            <p className="hero-copy">
              Safar Traders supports buyer-led sourcing, procurement coordination, and export supply
              for non-perishable industrial and commercial requirements.
            </p>

            <div className="hero-actions">
              <RFQWizardLauncher label="Request a Quote" className="btn btn-primary btn-lg" />
              <Link href="/products" className="btn btn-secondary btn-lg">
                View capabilities
              </Link>
              <a
                href={waLink(siteConfig.whatsappRaw, "Hi Safar Traders,\n\nI'd like to request a quotation for the following:\n\nProduct / Requirement: \nQuantity: \nDestination: \nGrade / Specification: \nAdditional details: \n\nPlease review and share the feasibility and pricing at your earliest convenience.\n\nThank you.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg"
                style={{ background: "var(--color-whatsapp)", color: "#fff", border: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.857L0 24l6.318-1.658A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.493-5.19-1.357l-.373-.22-3.75.984.999-3.656-.242-.384A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                WhatsApp
              </a>
              <a
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Quotation Request — [Your Product]")}&body=${encodeURIComponent("Hi Safar Traders,\n\nI'd like to request a quotation for the following:\n\nProduct / Requirement: \nQuantity: \nDestination: \nGrade / Specification: \nAdditional details: \n\nPlease review and share the feasibility and pricing at your earliest convenience.\n\nThank you,\n[Your Name]\n[Company]\n[Contact Number]")}`}
                className="btn btn-lg"
                style={{ background: "#1a73e8", color: "#fff", border: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
                Email
              </a>
            </div>

          </div>
        </div>

        {/* Proof strip */}
        <div className="hero-proof-grid">
          {proofItems.map(({ icon: Icon, title, text }) => (
            <article key={title} className="quiet-card">
              <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
