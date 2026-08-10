import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import PageHero from "@/components/PageHero";
import LeadCTA from "@/components/LeadCTA";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { FlaskConical, ShieldCheck, Handshake, Globe2 } from "lucide-react";
import sriramPhoto from "@/images/company-profile/Sriram.webp";
import mashukPhoto from "@/images/company-profile/Mohamed_Mashuk.webp";
import yusufPhoto from "@/images/company-profile/Mohamed_Yusuf.webp";

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

const team: { name: string; position: string; photo?: StaticImageData }[] = [
  { name: "Mohammed Mashuk A", position: "Founder & Director", photo: mashukPhoto },
  // { name: "Sriram B", position: "Director", photo: sriramPhoto },
  { name: "Mohammed Yusuf M", position: "Director", photo: yusufPhoto },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

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
            Meet the Safar Traders team.
          </h2>
          <div className="cp-team-grid">
            {team.map((member) => (
              <div key={member.name} className="cp-team-member">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={112}
                    height={112}
                    className="cp-team-avatar"
                  />
                ) : (
                  <span className="cp-team-avatar cp-team-avatar-initials" aria-hidden="true">
                    {getInitials(member.name)}
                  </span>
                )}
                <p className="cp-team-name">
                  {member.name}
                </p>
                <p className="cp-team-position">
                  {member.position}
                </p>
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
          gap: 1rem;
          max-width: 800px;
        }
        .cp-team-member {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 2.5rem 1.5rem 2rem;
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-lg);
          background: var(--color-surface);
          box-shadow: 0 8px 20px -18px rgba(0, 0, 0, 0.3);
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cp-team-member:hover {
          border-color: var(--color-accent);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -16px rgba(0, 0, 0, 0.25);
        }
        .cp-team-avatar {
          flex-shrink: 0;
          width: 112px;
          height: 112px;
          border-radius: 50%;
          object-fit: cover;
          object-position: top center;
          border: 3px solid var(--color-bg-secondary);
          outline: 1px solid var(--color-border-light);
        }
        .cp-team-avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-secondary);
          color: var(--color-accent);
          font-size: 1.85rem;
          font-weight: 700;
          letter-spacing: -.02em;
        }
        .cp-team-name {
          color: var(--color-text-primary);
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -.02em;
          line-height: 1.3;
        }
        .cp-team-position {
          color: var(--color-accent);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-top: -0.65rem;
        }
        @media (min-width: 600px) {
          .cp-team-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </>
  );
}
