"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import logo from "@/images/safartraders-logo.webp";
import RFQWizardLauncher from "./RFQWizardLauncher";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close the mobile menu automatically if the viewport grows past mobile width
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 640) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container-site header-inner">
        <Link href="/" className="brand-link" aria-label={`${siteConfig.name} home`} onClick={() => setMenuOpen(false)}>
          <Image src={logo} alt={siteConfig.name} height={84} priority className="brand-logo" />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>

        <div className="header-actions">
          <a href={`tel:${siteConfig.phoneRaw}`} className="phone-link">{siteConfig.phone}</a>
          <RFQWizardLauncher label="Request a Quote" className="btn btn-primary small-btn" />
        </div>

        <button className="mobile-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-nav-panel">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-nav-panel"
            className="mobile-nav-panel"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="mobile-nav-panel-scroll">
            <div className="container-site">
              <nav aria-label="Mobile navigation">
                {siteConfig.nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.18,
                      delay: prefersReducedMotion || !menuOpen ? 0 : 0.04 + i * 0.035,
                    }}
                  >
                    <Link href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
                  </motion.div>
                ))}
              </nav>
              {/* Request Quote already lives in the header (tablet+) — only repeat it here
                  on true mobile widths where the header button is hidden (see CSS .mobile-quote). */}
              <RFQWizardLauncher label="Request a Quote" className="btn btn-primary mobile-quote" />
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="mobile-nav-phone"
                onClick={() => setMenuOpen(false)}
              >
                Call {siteConfig.phone}
              </a>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
