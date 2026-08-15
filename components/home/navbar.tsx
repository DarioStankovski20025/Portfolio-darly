"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ArrowGlyph, CtaButton } from "@/components/ui/button";
import { nav, site } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Is this element sitting on a dark background?
 *
 * Walks up for the first ancestor with an opaque background and measures its
 * luminance. Deliberately *not* a `.on-dark` class check: dark device frames
 * and mock browser chrome carry `.on-dark` as nested islands on otherwise
 * light chapters, and a class lookup would report those as the chapter.
 */
function sitsOnDark(start: Element) {
  let node: Element | null = start;

  while (node && node !== document.documentElement) {
    const match = getComputedStyle(node).backgroundColor.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const [r, g, b, alpha = 1] = match[1].split(",").map(Number);
      if (alpha > 0.5) {
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5;
      }
    }
    node = node.parentElement;
  }

  return false;
}

/**
 * Which chapter is currently under the header.
 *
 * The bar is fixed and transparent until it condenses, so it has to take its
 * colour from whatever is behind it — otherwise it inherits `text-ink` from the
 * body and goes dark-on-dark over any dark section, which is invisible.
 *
 * Hit-testing a point just below the header is what makes this robust: it works
 * for any arrangement of chapters on any page, with no list to keep in sync,
 * and it costs one `elementsFromPoint` plus a short walk per scroll frame.
 */
function useOnDarkChapter() {
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      // Sample below the bar's own box so the header never tests itself.
      const probe = document.elementsFromPoint(window.innerWidth / 2, 92);
      // Resolve to the enclosing section, which skips both full-screen
      // overlays (the intro curtain isn't in one) and nested dark islands.
      const section = probe
        .map((node) => node.closest("section"))
        .find((node): node is HTMLElement => Boolean(node));

      setOnDark(section ? sitsOnDark(section) : false);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return onDark;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const onDark = useOnDarkChapter();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 28);
  });

  const dark = onDark || menuOpen;

  return (
    <>
      {/* Sits above the mobile overlay so the toggle stays reachable. */}
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[120] transition-colors duration-500",
          // `on-dark` re-points the contextual tokens too, so the wordmark dot,
          // the nav hover and the CTA all flip with the bar.
          dark ? "on-dark text-paper" : "text-ink",
        )}
      >
        <div className="shell">
          <motion.div
            className={cn(
              "pointer-events-auto mx-auto flex items-center justify-between rounded-[3px] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled && !menuOpen
                ? dark
                  ? "border border-[color-mix(in_oklab,#f5f7fa_14%,transparent)] bg-[color-mix(in_oklab,#07111f_72%,transparent)] shadow-[0_18px_50px_-30px_rgba(5,12,23,0.9)] backdrop-blur-xl"
                  : "border border-[color-mix(in_oklab,#07111f_12%,transparent)] bg-[color-mix(in_oklab,#f5f7fa_78%,transparent)] shadow-[0_18px_50px_-32px_rgba(7,17,31,0.28)] backdrop-blur-xl"
                : "border border-transparent bg-transparent",
            )}
            animate={{
              marginTop: scrolled && !menuOpen ? 12 : 22,
              paddingLeft: scrolled && !menuOpen ? 18 : 0,
              paddingRight: scrolled && !menuOpen ? 14 : 0,
              paddingTop: scrolled && !menuOpen ? 10 : 0,
              paddingBottom: scrolled && !menuOpen ? 10 : 0,
              maxWidth: scrolled && !menuOpen ? 1160 : 1680,
            }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Wordmark onClick={() => setMenuOpen(false)} />

            <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
              {nav.slice(0, 3).map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </nav>

            <div className="hidden lg:block">
              {/* Inverted against the chapter, or the button disappears into
                  the section it is sitting on. */}
              <CtaButton
                href="/contact"
                tone={dark ? "paper" : "ink"}
                size="md"
                className={cn("py-3.5 text-sm", scrolled && "py-3")}
              >
                Start a Project
              </CtaButton>
            </div>

            <MenuToggle open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
          </motion.div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Wordmark({
  onClick,
  className,
  large = false,
}: {
  onClick?: () => void;
  className?: string;
  large?: boolean;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      data-cursor="link"
      aria-label={`${site.name} — home`}
      className={cn("group relative inline-flex items-baseline", className)}
    >
      <span
        className={cn(
          "font-medium leading-none tracking-[-0.05em] transition-[letter-spacing] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:tracking-[-0.03em]",
          large ? "text-4xl" : "text-[1.6rem]",
        )}
      >
        {site.wordmark}
      </span>
      <span
        aria-hidden
        className={cn(
          "ml-[0.06em] inline-block rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.6] group-focus-visible:scale-[1.6]",
          large ? "size-2.5" : "size-[7px]",
        )}
      />
      <span className="sr-only">.</span>
    </Link>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      data-cursor="link"
      className="group relative block overflow-hidden text-[0.9375rem] font-medium tracking-[-0.01em]"
    >
      {/* the label rolls up and its twin arrives from below */}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
          {label}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full text-[var(--accent-contextual)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
        >
          {label}
        </span>
      </span>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  );
}

function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      className="relative z-[120] -mr-2 flex size-12 items-center justify-center lg:hidden"
    >
      <span className="relative block h-3 w-7">
        <motion.span
          className="absolute left-0 block h-px w-full bg-current"
          animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        <motion.span
          className="absolute left-0 block h-px w-full bg-current"
          animate={open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      </span>
    </button>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;

      // Keep tabbing inside the open menu — the toggle lives in the fixed
      // header above the overlay, so it joins the loop explicitly.
      const toggle = document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]');
      const focusable = [
        ...(toggle ? [toggle] : []),
        ...Array.from(
          panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
        ),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          className="on-dark fixed inset-0 z-[110] flex flex-col bg-ink text-paper lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* pt clears the fixed header, which stays above this overlay */}
          <div className="shell flex min-h-0 flex-1 flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24">
            <nav
              aria-label="Mobile"
              className="flex min-h-0 flex-1 flex-col justify-center gap-1 overflow-y-auto py-8"
            >
              {nav.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, delay: 0.08 + index * 0.05, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 border-b border-[var(--hairline)] py-4"
                  >
                    <span className="t-label text-[var(--muted-fg)]">
                      0{index + 1}
                    </span>
                    <span className="text-[clamp(2.25rem,11vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em]">
                      {item.label}
                    </span>
                    <ArrowGlyph className="ml-auto size-5 translate-y-[-0.15em] text-[var(--muted-fg)]" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            >
              <a
                href={`mailto:${site.email}`}
                className="t-label text-[var(--muted-fg)] transition-colors hover:text-paper"
              >
                {site.email}
              </a>
              <CtaButton
                href="/contact"
                tone="paper"
                size="lg"
                magnetic={false}
                onClick={onClose}
                className="w-full"
              >
                Start a Project
              </CtaButton>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
