"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type SlotImage = { src: string; alt: string } | null;

/**
 * A product image inside browser chrome — or, until the file exists, a
 * deliberate reserved slot.
 *
 * The placeholder keeps the same aspect box as the real image, so dropping a
 * file in later changes nothing about the layout. It is styled to read as
 * "reserved", not "broken".
 */
export function ImageSlot({
  image,
  label,
  caption,
  aspect = "16/9",
  priority,
  className,
}: {
  image: SlotImage;
  /** Shown in the chrome bar, e.g. "optiora.app". */
  label?: string;
  /** Small line under the frame. */
  caption?: string;
  aspect?: string;
  priority?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <figure className={cn("m-0", className)}>
      <motion.div
        className="on-dark overflow-hidden rounded-[8px] border border-[var(--hairline)] bg-device p-[clamp(0.3rem,0.5vw,0.5rem)] shadow-[0_50px_110px_-70px_rgba(7,11,15,0.5)]"
        initial={reduced ? undefined : { opacity: 0, y: 22 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: DUR.slow, ease: EASE }}
      >
        {label && (
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="size-[6px] rounded-full bg-white/20" />
            <span className="size-[6px] rounded-full bg-white/20" />
            <span className="size-[6px] rounded-full bg-white/20" />
            <span className="t-label-sm ml-2 truncate text-white/40">{label}</span>
          </div>
        )}

        <div
          className="relative w-full overflow-hidden rounded-[4px]"
          style={{ aspectRatio: aspect }}
        >
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <ReservedSlot />
          )}
        </div>
      </motion.div>

      {caption && (
        <figcaption className="t-label-sm mt-3 text-[var(--muted-fg)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Looks like a decision, not an accident. */
function ReservedSlot() {
  return (
    <div className="on-dark absolute inset-0 flex flex-col items-center justify-center gap-3 bg-device">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 12px)",
        }}
      />
      <span className="relative block size-2 rounded-full bg-[var(--accent-contextual)]" />
      <span className="relative t-label-sm text-white/45">Project image</span>
    </div>
  );
}
