"use client";

import { siteConfig } from "@/lib/site-config";
import { waLink } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const href = waLink(siteConfig.whatsappRaw, "Hello, I'd like to discuss a sourcing/export requirement. Could you please assist?");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 1rem))",
        right: "1.25rem",
        zIndex: 50,
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        backgroundColor: "var(--color-whatsapp)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(37,211,102,0.45)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(37,211,102,0.35)";
      }}
    >
      {/* WhatsApp SVG icon */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.513 5.823L.057 23.5a.5.5 0 0 0 .623.612l5.798-1.516A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 0 1-4.99-1.368l-.358-.212-3.712.97.994-3.612-.234-.372A9.767 9.767 0 0 1 2.182 12C2.182 6.565 6.565 2.182 12 2.182S21.818 6.565 21.818 12 17.435 21.818 12 21.818z"/>
      </svg>
    </a>
  );
}
