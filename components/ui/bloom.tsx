import { cn } from "@/lib/utils";

/**
 * Ambient colour behind a section.
 *
 * Large, heavily blurred radial washes in the brand blues — the thing that
 * stops a flat surface reading as flat. It reads the contextual `--glow-*`
 * tokens rather than fixed colours, so the same preset is a soft tint on a
 * light chapter and a real glow on a dark one; `.on-dark` carries roughly
 * double the alpha, because the value that glows on midnight only stains
 * cloud white.
 *
 * No JS and no animation: this is decoration that must never cost a frame or
 * delay a paint. `-z-10` puts it behind content, and the parent needs
 * `relative isolate overflow-hidden` (or `overflow-x-clip`) to contain it.
 */

type Preset = "dawn" | "dusk" | "halo" | "rise";

const PRESETS: Record<
  Preset,
  { tone: string; className: string }[]
> = {
  /** Electric blue high right, violet low left. The default. */
  dawn: [
    { tone: "var(--glow-accent)", className: "-right-[12%] -top-[18%] h-[46vw] w-[46vw]" },
    { tone: "var(--glow-violet)", className: "-bottom-[22%] -left-[14%] h-[40vw] w-[40vw]" },
  ],
  /** Mirrored — use on the section after a `dawn` so they don't stack. */
  dusk: [
    { tone: "var(--glow-sky)", className: "-left-[12%] -top-[16%] h-[42vw] w-[42vw]" },
    { tone: "var(--glow-accent)", className: "-bottom-[20%] -right-[10%] h-[44vw] w-[44vw]" },
  ],
  /** One wash centred behind a symmetrical composition. */
  halo: [
    {
      tone: "var(--glow-violet)",
      className: "left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2",
    },
  ],
  /** Light gathering along the bottom edge, for a section that hands off. */
  rise: [
    { tone: "var(--glow-accent)", className: "-bottom-[26%] left-1/2 h-[42vw] w-[70vw] -translate-x-1/2" },
    { tone: "var(--glow-sky)", className: "-top-[14%] right-[8%] h-[30vw] w-[30vw]" },
  ],
};

export function Bloom({
  preset = "dawn",
  className,
}: {
  preset?: Preset;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {PRESETS[preset].map((spot, index) => (
        <span
          key={index}
          className={cn("absolute block rounded-full blur-[90px]", spot.className)}
          style={{
            background: `radial-gradient(circle, ${spot.tone} 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
