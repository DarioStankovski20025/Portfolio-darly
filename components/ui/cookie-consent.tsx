"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { EASE } from "@/lib/motion";

const STORAGE_KEY = "darly.cookie-choice";

/**
 * Cookie consent.
 *
 * Bottom-right, light, and small enough to ignore — it asks once and then never
 * again. Two things worth knowing about how it is built:
 *
 * 1. It renders nothing on the server and nothing on the first client render.
 *    The answer lives in `localStorage`, which does not exist during SSR, so
 *    reading it during render would either mismatch on hydration or force the
 *    card to flash in for everyone who already answered. The mount effect is
 *    the only place it is read.
 *
 * 2. Declining is a real option with the same weight as accepting. A dialog
 *    where "no" is a grey whisper next to a filled "yes" is a dark pattern, and
 *    it is also illegal in most of the places this site is read from.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private mode, or storage disabled. Treat it as unanswered but do not
      // nag: if we cannot persist the answer, asking again every visit is
      // worse than not asking.
      return;
    }
    if (!stored) {
      // A beat after landing, so it does not collide with the intro curtain.
      const id = window.setTimeout(() => setOpen(true), 1400);
      return () => window.clearTimeout(id);
    }
  }, []);

  const answer = (choice: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* nothing we can do, and nothing worth breaking the UI over */
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          className="fixed inset-x-4 bottom-4 z-[160] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[min(23rem,calc(100vw-3rem))]"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE }}
        >
          <div className="rounded-[12px] border border-[var(--hairline)] bg-paper-2/95 p-[clamp(1.1rem,2vw,1.4rem)] shadow-[0_30px_70px_-30px_rgba(7,17,31,0.28)] backdrop-blur-md">
            <p id="cookie-title" className="t-label text-[var(--accent-contextual)]">
              Cookies
            </p>

            <p className="mt-3 text-[0.9375rem] leading-[1.55] text-[var(--on-surface)]">
              We use a couple of cookies to see which pages are worth keeping.
              No ad networks, nothing sold on.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => answer("accepted")}
                data-cursor="link"
                className="flex-1 rounded-[3px] bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-paper transition-opacity duration-300 hover:opacity-85"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => answer("declined")}
                data-cursor="link"
                className="flex-1 rounded-[3px] border border-[var(--hairline-strong)] px-4 py-2.5 text-[0.875rem] font-medium text-[var(--on-surface)] transition-colors duration-300 hover:border-[var(--accent-contextual)] hover:text-[var(--accent-contextual)]"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
