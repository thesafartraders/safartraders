"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, ShieldCheck, X } from "lucide-react";

const team = [
  // "Sriram B", 
  "Mohammed Mashuk A", 
  "Mohammed Yusuf M"];

/**
 * Small assistive "ball" anchored to the right edge of the hero, mobile only.
 * Tap it, or swipe it left from the right edge, to open a short dialog
 * pointing buyers to the Company Profile page.
 */
export default function CompanyProfileTeaser() {
  const [open, setOpen] = useState(false);
  const dragStartX = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Swiping left by a meaningful distance (or with velocity) opens the dialog.
    if (info.offset.x < -40 || info.velocity.x < -300) {
      setOpen(true);
    }
  };

  return (
    <div className="company-profile-teaser">
      <motion.button
        type="button"
        className="company-profile-ball"
        aria-label="View company profile"
        onClick={() => setOpen(true)}
        drag="x"
        dragConstraints={{ left: -10, right: 0 }}
        dragElastic={0.35}
        onDragStart={() => { dragStartX.current = 0; }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.94 }}
        animate={prefersReducedMotion ? undefined : { x: [0, -6, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 2.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
      >
        <FileText size={18} strokeWidth={2} aria-hidden="true" />
      </motion.button>

      {typeof document !== "undefined" && createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="company-profile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="company-profile-dialog-title"
              className="company-profile-dialog"
              initial={prefersReducedMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, x: "-50%", y: 28 }}
              animate={{ opacity: 1, x: "-50%", y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, x: "-50%", y: 18 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="company-profile-dialog-topbar">
                <span>Safar Traders</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="company-profile-dialog-close"
                  aria-label="Close company profile"
                  onClick={() => setOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="company-profile-dialog-content">
                <p className="company-profile-dialog-eyebrow">About us</p>
                <h2 id="company-profile-dialog-title">Get to know Safar Traders.</h2>
                <p className="company-profile-dialog-copy">
                  Safar Traders is a procurement and export partner built on R&amp;D-led sourcing, verified suppliers, and a hands-on team that stays with your order from first requirement to final document.
                </p>

                {/* Name-first team list */}
                <div className="company-profile-team-grid" aria-label="The team">
                  {team.map((name) => (
                    <div className="company-profile-team-member" key={name}>
                      <span className="company-profile-team-name">{name}</span>
                    </div>
                  ))}
                </div>

                <div className="company-profile-trust-list" aria-label="Company profile contents">
                  <div><ShieldCheck size={19} aria-hidden="true" /><span>Our sourcing and trade approach</span></div>
                  <div><BadgeCheck size={19} aria-hidden="true" /><span>The team behind Safar Traders</span></div>
                  <div><FileText size={19} aria-hidden="true" /><span>Export and sourcing capabilities</span></div>
                </div>
              </div>

              <div className="company-profile-dialog-footer">
                <Link href="/company-profile" className="company-profile-dialog-exit" onClick={() => setOpen(false)}>
                  View company profile <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </div>
  );
}
