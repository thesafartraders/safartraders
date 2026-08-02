import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resourceGuides } from "@/lib/resources";

export default function ResourcesTeaser() {
  return (
    <section className="resources-teaser section-pad bg-light" aria-labelledby="resources-teaser-title">
      <div className="container-site">
        <div className="section-heading-row resources-teaser-heading">
          <div>
            <span className="eyebrow">Buyer resources</span>
            <h2 id="resources-teaser-title" className="section-title small">Make the next sourcing conversation more productive.</h2>
          </div>
          <Link href="/resources" className="resource-readmore resources-teaser-all">
            All buyer resources <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="resources-teaser-grid">
          {resourceGuides.slice(0, 3).map((guide) => (
            <Link key={guide.slug} href={`/resources/${guide.slug}`} className="resources-teaser-card">
              <Image
                src={guide.image}
                alt={guide.imageAlt}
                sizes="(min-width: 1160px) 365px, (min-width: 700px) 33vw, 100vw"
                className="resources-teaser-image"
              />
              <span className="resource-label">{guide.category}</span>
              <h3>{guide.title}</h3>
              <span className="resources-teaser-link">Read guide <ArrowRight size={14} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
