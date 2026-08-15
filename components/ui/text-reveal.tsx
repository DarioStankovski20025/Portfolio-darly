"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useMemo, useRef, type ElementType } from "react";

import { DUR, EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type Piece = {
  text: string;
  className?: string;
  /**
   * Replaces the default per-word hover treatment for this piece. Needed for
   * gradient pieces: `.text-gradient` sets `-webkit-text-fill-color:
   * transparent`, which beats `color`, so a colour hover on one is invisible.
   * Those want a `filter` instead. Only read when `hover` is on.
   */
  hoverClassName?: string;
};
export type Line = Piece[];

/**
 * The hover carrier.
 *
 * This has to be a span *nested inside* the animating `motion.span`, never the
 * motion span itself: framer writes `transform` there as an inline style, and
 * inline beats any Tailwind class, so a `hover:-translate-y-*` on it would
 * silently do nothing.
 */
const HOVER_BASE =
  "inline-block transition-[transform,color,filter] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[0.06em]";

const HOVER_DEFAULT = `${HOVER_BASE} hover:text-[var(--accent-contextual)]`;

/**
 * For gradient-filled words.
 *
 * This carries `.text-gradient` itself rather than leaving it on the piece's
 * own className, and that is load-bearing. `background-clip: text` paints the
 * background through the glyphs of the element it is set on; a descendant with
 * a `filter` becomes its own stacking context, drops out of that paint, and the
 * word vanishes on hover — inheriting `-webkit-text-fill-color: transparent`
 * with no background of its own to show through. Putting the gradient on the
 * same element as the filter means `brightness()` acts on the already-clipped
 * result, which is exactly what we want.
 */
export const HOVER_GRADIENT = `${HOVER_BASE} text-gradient hover:brightness-[1.22] hover:saturate-[1.1]`;

type TextRevealProps = {
  /** Each inner array is one visual line; each piece can carry its own styling. */
  lines: Line[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  id?: string;
  delay?: number;
  stagger?: number;
  /** Play immediately on mount instead of waiting for the viewport. */
  immediate?: boolean;
  /** With `immediate`, gates the start (used to wait out the intro curtain). */
  play?: boolean;
  once?: boolean;
  /**
   * Pixels of blur each word resolves out of, on top of the mask slide.
   * Off by default — animating `filter` costs a repaint per frame per word, so
   * it is reserved for the one headline a visitor lands on.
   */
  blur?: number;
  /**
   * Per-word hover: a small lift, and a colour shift on words that can take
   * one. Off by default — this is a hero affordance, and every other headline
   * on the site would change character if it were on everywhere. When off, no
   * extra element is rendered at all.
   */
  hover?: boolean;
};

/**
 * Word-by-word mask reveal. Every word sits in its own overflow-hidden box and
 * slides up from below the mask — the effect the whole page opens with.
 *
 * The viewport trigger deliberately lives on the *heading*, not on the words.
 * Each word starts translated 110% down, which puts it outside its own
 * overflow-hidden mask; an IntersectionObserver clips a target by its ancestors,
 * so a per-word observer would measure 0% visible, never cross its threshold,
 * and the headline would stay invisible forever. Observing the unclipped root
 * once and driving every word from that boolean avoids the deadlock — and costs
 * one observer per headline instead of one per word.
 */
export function TextReveal({
  lines,
  as = "h2",
  className,
  lineClassName,
  id,
  delay = 0,
  stagger = STAGGER.tight,
  immediate = false,
  play = true,
  once = true,
  blur = 0,
  hover = false,
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, amount: 0.25 });

  // Words carry a document-order index so the stagger runs across line breaks.
  const composed = useMemo(() => {
    let index = 0;
    return lines.map((line) =>
      line.map((piece) => {
        const words = piece.text.split(" ");
        return {
          className: piece.className,
          hoverClassName: piece.hoverClassName,
          words: words.map((word, i) => ({
            // keep the space that split() removed, so the text reads correctly
            text: i < words.length - 1 ? `${word} ` : word,
            index: index++,
          })),
        };
      }),
    );
  }, [lines]);

  const active = immediate ? play : inView;
  const softness = reduced ? 0 : blur;
  const hidden = reduced
    ? { opacity: 0 }
    : { y: "110%", opacity: 0, filter: `blur(${softness}px)` };
  const shown = { y: "0%", opacity: 1, filter: "blur(0px)" };
  const Tag = as as React.ElementType<{
    ref?: React.Ref<HTMLElement>;
    id?: string;
    className?: string;
    children?: React.ReactNode;
  }>;

  return (
    <Tag ref={ref} id={id} className={cn("[text-wrap:balance]", className)}>
      {composed.map((line, i) => (
        <span key={i} className={cn("block", lineClassName)}>
        {line.map((piece, j) =>
          piece.words.map((word) => (
            <span
              key={`${i}-${j}-${word.index}`}
              // pb/-mb keeps descenders off the mask; pr/-mr does the same for
              // the rightward overhang of an italic, which `.editorial` pieces
              // have and which the mask would otherwise shave.
              className="inline-flex overflow-hidden pb-[0.14em] -mb-[0.14em] pr-[0.06em] -mr-[0.06em] align-bottom"
            >
              <motion.span
                className={cn("inline-block whitespace-pre", piece.className)}
                initial={hidden}
                animate={active ? shown : hidden}
                transition={{
                  duration: reduced ? 0.2 : DUR.slow,
                  delay: active ? delay + word.index * (reduced ? 0 : stagger) : 0,
                  ease: EASE,
                }}
              >
                {hover ? (
                  <span className={piece.hoverClassName ?? HOVER_DEFAULT}>
                    {word.text}
                  </span>
                ) : (
                  word.text
                )}
              </motion.span>
            </span>
          )),
        )}
        </span>
      ))}
    </Tag>
  );
}
