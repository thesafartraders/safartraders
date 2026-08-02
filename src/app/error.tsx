"use client";

import { useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { waLink } from "@/lib/whatsapp";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Keep the detailed error out of the browser while retaining it in host logs.
    console.error("Route rendering failed", error);
  }, [error]);

  return (
    <section className="section-pad">
      <div className="container-site" style={{ maxWidth: "720px" }}>
        <span className="eyebrow">Something went wrong</span>
        <h1 className="section-title">We could not load this page.</h1>
        <p className="section-copy">Please try again. You can also send your requirement directly and our team will follow up.</p>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" onClick={reset}>Try again</button>
          <a className="btn btn-secondary" href={waLink(siteConfig.whatsappRaw)}>Continue on WhatsApp</a>
          <Link className="btn btn-secondary" href={`mailto:${siteConfig.email}`}>Email us</Link>
        </div>
      </div>
    </section>
  );
}
