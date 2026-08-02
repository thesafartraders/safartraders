import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import LeadCTA from "@/components/LeadCTA";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { FlaskConical, ShieldCheck, Handshake, Globe2 } from "lucide-react";
import teamMashok from "@/images/company-profile/mashok.jpg";
import teamSreeram from "@/images/company-profile/sreeram.jpg";
import teamBhaiImg from "@/images/company-profile/bhaiimg.png";

export const metadata: Metadata = createPageMetadata({
  pathname: "/company-profile",
  title: "Safar Traders Company Profile — Export Partner",
  description: "Explore Safar Traders' R&D-led sourcing, verified supplier network, and hands-on procurement and export support from India.",
});

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home" }, { name: "Company Profile", pathname: "/company-profile" }]);

const pillars = [
  {
    icon: FlaskConical,
    title: "R&D-led sourcing",
    text: "Every requirement goes through a research and development review before it reaches a supplier — so specifications, grades, and quality are verified up front, not after the fact.",
  },
  {
    icon: ShieldCheck,
    title: "Practical trade experience",
    text: "Our team brings practical trading and export experience to sourcing, documentation, and shipment coordination.",
  },
  {
    icon: Handshake,
    title: "Hands-on team",
    text: "A direct point of contact who knows your order, from first requirement to final document.",
  },
  {
    icon: Globe2,
    title: "Domestic and export ready",
    text: "Whether you're sourcing locally or importing from overseas, the same disciplined process applies — specification, verification, documentation.",
  },
];

const team = [
  {
    name: "Mashok",
    image: teamMashok,
    role: "Sourcing & Operations",
  },
  {
    name: "Sreeram",
    image: teamSreeram,
    role: "Trade & Export",
  },
  {
    name: "Bhai",
    image: teamBhaiImg,
    role: "Export & Documentation",
  },
];

export default function CompanyProfilePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow="Company Profile"
        title="Safar Traders — procurement and export partner."
        description="We are a procurement and export partner built around R&D-led sourcing, verified suppliers, and a team that stays with your order through documentation and shipment coordination."
        breadcrumbs={[{ label: "Company Profile" }]}
      />

      {/* Story */}
      <section style={{
        backgroundColor: "var(--color-bg)",
        paddingTop: "4rem",
        paddingBottom: "4rem",
        borderBottom: "1px solid var(--color-border-light)",
      }}>
        <div className="container-site">
          <div className="cp-2col">
            <div>
              <span className="eyebrow" style={{ marginBottom: "0.75rem", display: "block" }}>Who we are</span>
              <h2 style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                lineHeight: 1.2,
              }}>
                Experienced, research-driven, and easy to reach.
              </h2>
            </div>
            <div>
              <p style={{ fontSize: "1rem", color: "var(--color-text-secondary)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                Safar Traders applies practical trading and export experience to every requirement. We don&apos;t just pass on a supplier&apos;s quote — every
                requirement goes through our own research and development check first, so the
                specification, grade, and quality are confirmed before anything is committed.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                We work across non-perishable industrial and commercial goods, handling sourcing,
                supplier verification, documentation, and shipment coordination as one connected
                process. Buyers deal with one team, not a chain of intermediaries — and that team is
                genuinely experienced in the categories we cover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section style={{
        backgroundColor: "var(--color-bg-secondary)",
        paddingTop: "4rem",
        paddingBottom: "4rem",
        borderBottom: "1px solid var(--color-border-light)",
      }}>
        <div className="container-site">
          <span className="eyebrow" style={{ marginBottom: "2rem", display: "block" }}>What sets us apart</span>
          <div className="cp-pillars-grid">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div key={title} style={{
                padding: "1.5rem",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border-light)",
                borderRadius: "var(--radius-md)",
              }}>
                <Icon size={22} strokeWidth={1.8} style={{ color: "var(--color-accent)", marginBottom: "0.75rem" }} />
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.625rem" }}>
                  {title}
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{
        backgroundColor: "var(--color-bg)",
        paddingTop: "4rem",
        paddingBottom: "4.5rem",
      }}>
        <div className="container-site">
          <span className="eyebrow" style={{ marginBottom: "0.5rem", display: "block" }}>The team</span>
          <h2 style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
            marginBottom: "2rem",
          }}>
            The people behind your order.
          </h2>
          <div className="cp-team-grid">
            {team.map((member) => (
              <div key={member.name} style={{ textAlign: "center" }}>
                <div style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--color-border-light)",
                  marginBottom: "1rem",
                }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 600px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <p style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.25rem" }}>
                  {member.name}
                </p>
                {member.role && (
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                    {member.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadCTA />

      <style>{`
        .cp-2col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 900px) {
          .cp-2col { grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: start; }
        }
        .cp-pillars-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .cp-pillars-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .cp-pillars-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .cp-team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 800px;
        }
        @media (min-width: 600px) {
          .cp-team-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </>
  );
}
