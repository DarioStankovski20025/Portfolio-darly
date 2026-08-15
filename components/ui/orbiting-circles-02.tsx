"use client";

import React, { useState } from "react";

import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";
import { brandIcons, type BrandIcon } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

/**
 * Orbiting circles globe — the centrepiece of the stack chapter.
 *
 * Built on the supplied component's orbit/counter-rotation keyframe technique,
 * with the changes the design needed:
 *  1. Brand marks are vendored locally (see lib/brand-icons.ts) — no external
 *     requests, nothing that can 404.
 *  2. Rings are centred rather than bottom-anchored, so the orbit reads as one
 *     system with Darly at the middle of it.
 *  3. Icons are distributed evenly by angle instead of mirrored — a full circle
 *     would otherwise show the same logo twice at once.
 *  4. Hovering a tool holds its ring and reports what it is and why we use it.
 *
 * Rings are sized as a percentage of a square container rather than in fixed
 * rem, so the outermost ring — and the chips riding on it — can never outgrow
 * the frame and get clipped at the top and bottom.
 */

export type StackGroup = BrandIcon["group"];

const RINGS: { size: number; duration: number; slugs: string[] }[] = [
  { size: 42, duration: 30, slugs: ["figma", "react", "claude", "webflow"] },
  { size: 62, duration: 40, slugs: ["nextjs", "typescript", "laravel", "gemini"] },
  { size: 82, duration: 52, slugs: ["node", "supabase", "cloudflare", "github"] },
];

/** Dark brand marks need inverting on a dark chip. */
function markColor(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.22 ? "#f5f7fa" : hex;
}

export default function OrbitingCirclesGlobe({
  activeGroup = null,
}: {
  activeGroup?: StackGroup | null;
}) {
  const [hovered, setHovered] = useState<BrandIcon | null>(null);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative mx-auto aspect-square w-full max-w-[min(94vw,780px)]">
        <style>{`
          @keyframes orbit-cw {
            from { transform: rotate(var(--start-angle)) }
            to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
          }

          @keyframes orbit-ccw {
            from { transform: rotate(var(--start-angle)) }
            to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
          }

          @keyframes counter-cw {
            from { transform: rotate(var(--counter-offset, 0deg)) }
            to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
          }

          @keyframes counter-ccw {
            from { transform: rotate(var(--counter-offset, 0deg)) }
            to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
          }

          @media (prefers-reduced-motion: reduce) {
            .darly-orbit-item, .darly-orbit-chip { animation: none !important; }
          }
        `}</style>

        {/* centre: Darly at the middle of the system */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 aspect-square w-36 -translate-x-1/2 -translate-y-1/2 md:w-64">
          <ParticleSphereAnimation />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-baseline text-[clamp(1.375rem,3.2vw,2.25rem)] font-medium leading-none tracking-[-0.05em] text-white">
              darly
              <span className="ml-px text-[var(--accent-contextual)]">.</span>
            </span>
          </div>
        </div>

        {RINGS.map((ring, ringIndex) => {
          const isCW = ringIndex % 2 === 0;
          const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
          const counterAnim = isCW ? "counter-cw" : "counter-ccw";
          const step = 360 / ring.slugs.length;
          const icons = ring.slugs
            .map((slug) => brandIcons.find((icon) => icon.slug === slug))
            .filter((icon): icon is BrandIcon => Boolean(icon));

          // Holding the ring the pointer is on makes the tool readable.
          const held = hovered ? ring.slugs.includes(hovered.slug) : false;

          return (
            <div
              key={ringIndex}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border"
              style={{ width: `${ring.size}%`, height: `${ring.size}%` }}
            >
              {icons.map((icon, iconIndex) => {
                const dimmed =
                  (activeGroup !== null && icon.group !== activeGroup) ||
                  (hovered !== null && hovered.slug !== icon.slug);
                const lit =
                  (activeGroup !== null && icon.group === activeGroup) ||
                  hovered?.slug === icon.slug;

                return (
                  <div
                    key={icon.slug}
                    className="darly-orbit-item absolute left-1/2 top-0 -ml-[22px] flex h-1/2 origin-bottom flex-col items-center justify-start sm:-ml-7"
                    style={
                      {
                        "--start-angle": `${iconIndex * step}deg`,
                        animation: `${orbitAnim} ${ring.duration}s linear infinite`,
                        animationPlayState: held ? "paused" : "running",
                      } as React.CSSProperties
                    }
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setHovered(icon)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(icon)}
                      onBlur={() => setHovered(null)}
                      aria-label={`${icon.title} — ${icon.group}`}
                      className={cn(
                        "darly-orbit-chip relative z-10 -mt-[22px] flex size-11 items-center justify-center rounded-full border transition-all duration-300 sm:-mt-7 sm:size-14",
                        dimmed
                          ? "border-border bg-device opacity-25"
                          : "border-border bg-device opacity-100",
                        lit && "scale-110 border-[var(--accent-contextual)]",
                      )}
                      style={
                        {
                          "--counter-offset": `${-iconIndex * step}deg`,
                          animation: `${counterAnim} ${ring.duration}s linear infinite`,
                          animationPlayState: held ? "paused" : "running",
                        } as React.CSSProperties
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        role="img"
                        aria-hidden
                        className="size-5 md:size-7"
                        fill={markColor(icon.hex)}
                      >
                        <path d={icon.path} />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* readout — fixed height so hovering never shifts the layout */}
      <div className="flex h-[74px] flex-col items-center justify-start text-center">
        <span
          className={cn(
            "text-[1.125rem] font-medium tracking-[-0.02em] transition-opacity duration-300",
            hovered ? "opacity-100" : "opacity-0",
          )}
        >
          {hovered?.title ?? "—"}
        </span>
        <span
          className={cn(
            "t-label-sm mt-2 text-[var(--accent-contextual)] transition-opacity duration-300",
            hovered ? "opacity-100" : "opacity-0",
          )}
        >
          {hovered?.group ?? ""}
        </span>
        <span
          className={cn(
            "t-body mt-1.5 text-[0.875rem] transition-opacity duration-300",
            hovered ? "opacity-100" : "opacity-0",
          )}
        >
          {hovered?.note ?? ""}
        </span>
      </div>
    </div>
  );
}
