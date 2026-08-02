import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, MessageCircle, X } from "lucide-react";
import { resourceGuides, type ResourceGuide } from "@/lib/resources";
import { siteConfig } from "@/lib/site-config";
import { waLink } from "@/lib/whatsapp";
import RFQWizardLauncher from "./RFQWizardLauncher";

export default function ResourceGuidePage({ guide }: { guide: ResourceGuide }) {
  const relatedBySlug = (guide.relatedSlugs ?? [])
    .map((slug) => resourceGuides.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is ResourceGuide => Boolean(candidate));
  const related = [
    ...relatedBySlug,
    ...resourceGuides.filter((g) => g.slug !== guide.slug && g.category === guide.category),
    ...resourceGuides.filter((g) => g.slug !== guide.slug && !relatedBySlug.some((relatedGuide) => relatedGuide.slug === g.slug)),
  ].filter((g, index, guides) => guides.findIndex((candidate) => candidate.slug === g.slug) === index).slice(0, 3);
  const guideUrl = `${siteConfig.url}/resources/${guide.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${guideUrl}#article`,
    headline: guide.title,
    description: guide.metaDescription,
    author: { "@id": `${siteConfig.url}/#organization` },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: guideUrl,
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    image: `${siteConfig.url}${guide.image.src}`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${siteConfig.url}/resources` },
      { "@type": "ListItem", position: 3, name: guide.title, item: guideUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="guide-hero">
        <div className="container-site">
          <Link href="/resources" className="guide-back">
            <ArrowLeft size={14} aria-hidden="true" /> All buyer resources
          </Link>
          <span className="eyebrow">{guide.category}</span>
          <div className="guide-hero-content">
            <div>
              <h1 className="guide-title">{guide.title}</h1>
              <p className="guide-summary">{guide.summary}</p>
              <span className="guide-readtime">
                {guide.readTime} · Updated {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${guide.dateModified}T00:00:00Z`))}
              </span>
            </div>
            <div className="guide-hero-image-wrap">
              <Image src={guide.image} alt={guide.imageAlt} className="guide-hero-image" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad-sm bg-white">
        <div className="container-site guide-layout">
          <article className="guide-article">
            {guide.intro.map((para, i) => (
              <p key={i} className="guide-intro-p">{para}</p>
            ))}

            {guide.sections.map((section) => (
              <div key={section.heading} className="guide-section">
                <h2>{section.heading}</h2>
                {section.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ))}

            <div className="guide-checklist-block">
              <h2>{guide.checklist.heading}</h2>
              <ul className="guide-checklist">
                {guide.checklist.items.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="guide-mistakes-block">
              <h2>{guide.mistakes.heading}</h2>
              <ul className="guide-mistakes">
                {guide.mistakes.items.map((item) => (
                  <li key={item}>
                    <X size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="guide-why-block">
              <span className="guide-why-label">Why it matters</span>
              <p>{guide.why}</p>
            </div>

            {guide.links && guide.links.length > 0 && (
              <nav className="guide-links" aria-label="Related resources">
                <span className="guide-links-label">Keep reading</span>
                <ul>
                  {guide.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </article>

          <aside className="guide-sidebar">
            <div className="sidebar-info-card">
              <p className="sidebar-info-heading">Ready to request a quote?</p>
              <p className="sidebar-info-copy">
                Send your product, quantity, destination, and timeline — we&apos;ll review feasibility before discussing terms.
              </p>
              <RFQWizardLauncher label="Request a Quote" className="btn btn-primary" />
              <a
                href={waLink(siteConfig.whatsappRaw)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ width: "100%", marginTop: ".6rem" }}
              >
                Discuss on WhatsApp <MessageCircle size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="sidebar-info-card">
              <p className="sidebar-info-heading">More buyer guides</p>
              <ul className="sidebar-related-list">
                {related.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/resources/${g.slug}`}>
                      <span className="sidebar-related-cat">{g.category}</span>
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
