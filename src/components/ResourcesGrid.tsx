import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { resourceGuides } from "@/lib/resources";
import { siteConfig } from "@/lib/site-config";
import { waLink } from "@/lib/whatsapp";
import RFQWizardLauncher from "./RFQWizardLauncher";

export default function ResourcesGrid() {
  return (
    <div className="resources-guide">
      <div className="resources-grid">
        {resourceGuides.map((item) => (
          <article key={item.slug} className="resource-card">
            <div className="resource-card-image-wrap">
              <Image src={item.image} alt={item.imageAlt} className="resource-card-image" />
            </div>
            <span className="resource-label">{item.category}</span>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
            <span className="resource-readtime">
              {item.readTime} · Updated {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${item.dateModified}T00:00:00Z`))}
            </span>
            <Link href={`/resources/${item.slug}`} className="resource-readmore">
              Read more <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>

      <div className="resource-cta">
        <div>
          <span className="resource-label">Next step</span>
          <h2>Prepared your requirement? Request a quotation.</h2>
          <p>
            Send the product details, quantity, destination, and timeline so Safar Traders
            can review sourcing feasibility.
          </p>
        </div>
        <div className="resource-cta-actions">
          <RFQWizardLauncher label="Request a Quote" className="btn btn-primary" />
          <a
            href={waLink(siteConfig.whatsappRaw)}
            className="btn btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discuss on WhatsApp
            <MessageCircle size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
