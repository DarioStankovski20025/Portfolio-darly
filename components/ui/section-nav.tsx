"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type NavItem = { id: string; label: string };

/** Clears the fixed navbar (and, below lg, the sticky chapter bar). */
const SCROLL_OFFSET = 112;
const SCROLL_OFFSET_SM = 144;

/**
 * Tracks which chapter is in the reading band.
 *
 * The observer watches the `<section id>` wrappers and nothing else. Children
 * here are transform-translated by the reveal animations, and an observer clips
 * a target by its ancestors — so watching a translated child would report zero
 * intersection forever and the rail would never update. This codebase has
 * already been bitten by exactly that (see components/ui/text-reveal.tsx).
 */
function useActiveSection(items: NavItem[]) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (sections.length === 0) return;

    const visible = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));

        // First tracked section in document order that is currently in the
        // band. Never clear on an empty set — keeping the last one avoids
        // flicker through the gaps between chapters.
        const next = items.find((item) => visible.get(item.id));
        if (next) setActive(next.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));

    // The last chapter is short and may never reach the band; the first is
    // above it on load. Two cheap guards cover both ends.
    const onScroll = () => {
      if (window.scrollY < 240) {
        setActive(items[0].id);
      } else if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 4
      ) {
        setActive(items[items.length - 1].id);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return active;
}

/**
 * How far through the chaptered body the reader is, 0–1.
 *
 * Measured against the element that actually contains the chapters rather than
 * the document, so the case-study hero above it and the CTA and footer below it
 * do not eat most of the bar's range.
 */
function useTrackProgress(trackId?: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!trackId) return;

    const update = () => {
      const track = document.getElementById(trackId);
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 1 : 0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, -rect.top / total)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [trackId]);

  return progress;
}

/**
 * Reveals the rail only while the chaptered body is on screen, so it never
 * overlaps the hero above it or the CTA and footer below it.
 */
function useRailVisible(trackId?: string) {
  // Without a track there is nothing to hide against, so start shown rather
  // than flipping it from inside the effect.
  const [visible, setVisible] = useState(!trackId);

  useEffect(() => {
    if (!trackId) return;
    const track = document.getElementById(trackId);
    if (!track) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // Arms a little before the body arrives and drops it a little before it
      // leaves, so the fade never collides with the section boundary.
      { rootMargin: "-15% 0px -25% 0px", threshold: 0 },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackId]);

  return visible;
}

/**
 * Chapter navigation for long-form pages.
 *
 * Rendered twice per page — `bar` outside the grid so it can span the viewport
 * on small screens, `rail` fixed to the left gutter on desktop. Links are real
 * anchors, so the page still navigates without JS and every item is keyboard
 * reachable; the click handler takes over when JS is available so it can
 * subtract the fixed navbar and move focus to the heading it just jumped to.
 */
export function SectionNav({
  items,
  variant,
  className,
  /** Element the rail should live and measure against. */
  trackId,
}: {
  items: NavItem[];
  variant: "rail" | "bar";
  className?: string;
  trackId?: string;
}) {
  const active = useActiveSection(items);
  const progress = useTrackProgress(trackId);
  const visible = useRailVisible(trackId);
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === active),
  );

  /**
   * `scroll-padding-top` alone leaves keyboard users focused at the top of the
   * document, and it does not account for the mobile chapter bar. Doing the
   * arithmetic here fixes both, and still degrades to the plain anchor when JS
   * is unavailable.
   */
  const jumpTo = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      // Let modified clicks (new tab, download) behave normally.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      const offset =
        window.matchMedia("(min-width: 1024px)").matches
          ? SCROLL_OFFSET
          : SCROLL_OFFSET_SM;

      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - offset,
        behavior: reduced ? "auto" : "smooth",
      });
      window.history.replaceState(null, "", `#${id}`);

      // Focus without a second scroll — the smooth one above is already
      // running and `focus()` would otherwise snap it to the element.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [reduced],
  );

  // Keep the active chip on screen. Setting scrollLeft directly rather than
  // scrollIntoView, which also moves the vertical scroll position and fights
  // the observer.
  useEffect(() => {
    if (variant !== "bar") return;
    const rail = railRef.current;
    if (!rail) return;
    const chip = rail.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (!chip) return;
    rail.scrollTo({
      left: Math.max(0, chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2),
      behavior: "smooth",
    });
  }, [active, variant]);

  if (variant === "bar") {
    return (
      <nav
        aria-label="Chapters"
        className={cn(
          "sticky top-[68px] z-[80] -mx-[clamp(1.25rem,3.2vw,4rem)] border-y border-[var(--hairline)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)] backdrop-blur-xl lg:hidden",
          className,
        )}
      >
        {/* reading progress, edge to edge */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px">
          <div
            className="rule-gradient h-full origin-left transition-transform duration-200 ease-linear"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        <div
          ref={railRef}
          className="mask-fade-r flex gap-1 overflow-x-auto px-[clamp(1.25rem,3.2vw,4rem)] py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => {
            const isActive = item.id === active;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => jumpTo(event, item.id)}
                data-chip={item.id}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 rounded-[3px] px-3 py-2 transition-colors duration-300",
                  isActive ? "text-[var(--surface)]" : "text-[var(--muted-fg)]",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="chapter-chip"
                    className="absolute inset-0 -z-10 block rounded-[3px] bg-[var(--on-surface)]"
                    transition={{ duration: DUR.base, ease: EASE }}
                  />
                )}
                <span className="t-label-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="whitespace-nowrap text-[0.8125rem] font-medium tracking-[-0.01em]">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Chapters"
      className={cn(
        // Fixed, not sticky: the rail used to be a grid child and stopped
        // travelling the moment the chapter column ended, which is exactly
        // where a reader still wants it.
        "pointer-events-none fixed left-[clamp(1.25rem,3.2vw,4rem)] top-1/2 z-[70] hidden w-[clamp(9rem,13vw,13rem)] -translate-y-1/2 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
        className,
      )}
      // Hidden from the tree while faded out, so tabbing never lands on an
      // invisible list of links.
      aria-hidden={!visible}
    >
      <div className={cn(visible && "pointer-events-auto")}>
        <ol className="flex flex-col">
          {items.map((item, index) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  onClick={(event) => jumpTo(event, item.id)}
                  aria-current={isActive ? "true" : undefined}
                  tabIndex={visible ? 0 : -1}
                  data-cursor="link"
                  className="group flex items-baseline gap-3 border-l border-[var(--hairline)] py-2.5 pl-4 transition-colors duration-300 hover:border-[var(--hairline-strong)]"
                >
                  {isActive && (
                    <motion.span
                      layoutId="chapter-marker"
                      className="rule-gradient absolute inset-y-0 left-0 block w-[2px]"
                      transition={{ duration: DUR.base, ease: EASE }}
                    />
                  )}
                  <span
                    className={cn(
                      "t-label-sm shrink-0 transition-colors duration-300",
                      isActive ? "text-[var(--accent-contextual)]" : "text-[var(--muted-fg)]",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] transition-colors duration-300",
                      isActive
                        ? "text-[var(--on-surface)]"
                        : "text-[var(--muted-fg)] group-hover:text-[var(--on-surface)]",
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex items-center gap-3 pl-4">
          <span className="t-num text-sm text-[var(--accent-contextual)]">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <div className="relative h-px flex-1 bg-[var(--hairline)]">
            <div
              className="rule-gradient absolute inset-y-0 left-0 w-full origin-left transition-transform duration-200 ease-linear"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <span className="t-label-sm text-[var(--muted-fg)]">
            {String(items.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </nav>
  );
}
