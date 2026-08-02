import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { productCategories } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import { waLink } from "@/lib/whatsapp";
import logo from "@/images/safartraders.webp";
import RFQWizardLauncher from "./RFQWizardLauncher";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Company Profile", href: "/company-profile" },
  { label: "Export Process", href: "/export-process" },
  { label: "Why Us", href: "/why-us" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-site footer-grid">
        <div className="footer-brand">
          <Link href="/" aria-label={`${siteConfig.name} home`} className="footer-logo-link">
            <Image src={logo} alt={siteConfig.name} height={96} className="footer-logo" />
          </Link>
          <p>Trade and export partner for buyers sourcing non-perishable industrial and commercial goods — procurement coordination, documentation support, and supply handling from India.</p>
          <div className="footer-contact-list">
            <a href={`tel:${siteConfig.phoneRaw}`}><Phone size={14} aria-hidden="true" />{siteConfig.phone}</a>
            <a href={`tel:${siteConfig.phoneSecondaryRaw}`}><Phone size={14} aria-hidden="true" />{siteConfig.phoneSecondary}</a>
            <a href={`mailto:${siteConfig.email}`}><Mail size={14} aria-hidden="true" />{siteConfig.email}</a>
            <span><MapPin size={14} aria-hidden="true" />{siteConfig.address.city}, {siteConfig.address.state}, {siteConfig.address.country}</span>
          </div>
        </div>

        <div>
          <p className="footer-heading">Capabilities</p>
          <ul>
            {productCategories.map((item) => <li key={item.slug}><Link href={`/products/${item.slug}`}>{item.shortTitle}</Link></li>)}
            <li><Link href="/products">All Capabilities</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-heading">Company</p>
          <ul>
            {companyLinks.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}
            <li><RFQWizardLauncher label="Request a Quote" className="footer-rfq-button" /></li>
          </ul>
        </div>
        <div>
          <p className="footer-heading">Get in touch</p>
          <ul>
            <li><a href={waLink(siteConfig.whatsappRaw, "Hello Safar Traders, I'd like to discuss a sourcing/export requirement.")} target="_blank" rel="noopener noreferrer">WhatsApp requirement</a></li>
            <li><a href={`mailto:${siteConfig.email}`}>Trade email</a></li>
          </ul>
        </div>
      </div>
      <div className="container-site footer-bottom">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved. · <Link href={siteConfig.legal.privacyPolicyUrl}>Privacy Policy</Link> · <Link href={siteConfig.legal.termsUrl}>Terms &amp; Conditions</Link></p>
        <p>Trade & export · Procurement coordination · Documentation support</p>
      </div>
    </footer>
  );
}
