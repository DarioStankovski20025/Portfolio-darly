"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { EASE } from "@/lib/motion";

const IntroContext = createContext({ ready: true });

/** Lets the hero hold its entrance until the curtain is on its way up. */
export const useIntro = () => useContext(IntroContext);

const CURTAIN_MS = 720;

export function Intro({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  // Both flags start false on the server and on the first client render, and
  // are only ever flipped from a timer callback — no synchronous setState.
  const [dismissed, setDismissed] = useState(false);
  const [released, setReleased] = useState(false);

  const showCurtain = !dismissed;
  const ready = released || Boolean(reduced);

  useEffect(() => {
    // Reduced motion tears the curtain down on the next tick instead of
    // holding the page for a second.
    const lift = window.setTimeout(() => setDismissed(true), reduced ? 0 : CURTAIN_MS);
    const release = window.setTimeout(
      () => setReleased(true),
      reduced ? 0 : CURTAIN_MS - 200,
    );

    return () => {
      window.clearTimeout(lift);
      window.clearTimeout(release);
    };
  }, [reduced]);

  // The curtain clamps body overflow for 720ms, which collapses max scroll to
  // zero. With the browser's default `auto` scroll restoration, a reload defers
  // its restore and lands it the moment the lock releases — reading as a jump
  // to the bottom of a very tall page. Take restoration into our own hands and
  // start at the top, unless the URL points somewhere specific.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!showCurtain) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showCurtain]);

  return (
    <IntroContext.Provider value={{ ready }}>
      {/* Without JS nothing can lift the curtain, so it never renders. */}
      <noscript>
        <style>{`[data-intro-curtain]{display:none !important}`}</style>
      </noscript>

      <AnimatePresence>
        {showCurtain && (
          <motion.div
            key="curtain"
            data-intro-curtain=""
            aria-hidden
            className="fixed inset-0 z-[200] flex items-end justify-start bg-paper px-[clamp(1.25rem,4vw,5rem)] pb-[clamp(2rem,6vw,4rem)]"
            initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
          >
            <div className="w-full">
              <motion.div
                className="flex items-baseline"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <span className="text-[clamp(3rem,10vw,7rem)] font-medium leading-[0.85] tracking-[-0.05em] text-ink">
                  darly
                </span>
                <motion.span
                  className="text-[clamp(3rem,10vw,7rem)] font-medium leading-[0.85] tracking-[-0.05em] text-[var(--accent-contextual)]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                >
                  .
                </motion.span>
              </motion.div>

              <div className="relative mt-[clamp(1.25rem,3vw,2rem)] h-px w-full bg-[var(--hairline)]">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: CURTAIN_MS / 1000, ease: EASE }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </IntroContext.Provider>
  );
}
