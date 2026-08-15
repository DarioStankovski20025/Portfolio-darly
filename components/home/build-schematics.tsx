"use client";

import { motion } from "framer-motion";

import { EASE } from "@/lib/motion";

/**
 * One schematic per build category.
 *
 * These are diagrams, not screenshots — the point is that a visitor understands
 * the *shape* of the thing we'd build for them in about a second, without
 * reading. They draw themselves in with `pathLength`, the same idiom the "Why
 * Darly" diagrams use, so the whole page moves the same way.
 *
 * Everything is authored in a fixed 320×200 viewBox and scaled by the parent,
 * which keeps stroke weights consistent across breakpoints when paired with
 * `vectorEffect="non-scaling-stroke"`.
 */

const VIEW = "0 0 320 200";

const line = (delay: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 0.8, delay, ease: EASE },
});

const pop = (delay: number) => ({
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5, delay, ease: EASE },
});

/** Shared chrome: a soft node box with a label baked in. */
function Node({
  x,
  y,
  w,
  h,
  label,
  delay,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.g {...pop(delay)} style={{ originX: `${x + w / 2}px`, originY: `${y + h / 2}px` }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={accent ? "var(--accent-contextual)" : "transparent"}
        fillOpacity={accent ? 0.12 : 1}
        stroke={accent ? "var(--accent-contextual)" : "var(--hairline-strong)"}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={9}
        letterSpacing={0.6}
        fill={accent ? "var(--accent-contextual)" : "var(--muted-fg)"}
        style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
      >
        {label}
      </text>
    </motion.g>
  );
}

function Wire({ d, delay }: { d: string; delay: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="var(--accent-contextual)"
      strokeWidth={1}
      strokeOpacity={0.55}
      vectorEffect="non-scaling-stroke"
      {...line(delay)}
    />
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={VIEW} className="h-auto w-full" role="presentation">
      {children}
    </svg>
  );
}

/** 01 — a prompt fanning into a model, grounded by your own data. */
function AiProducts() {
  return (
    <Frame>
      <Node x={12} y={82} w={72} h={34} label="Prompt" delay={0.05} />
      <Wire d="M84 99 H128" delay={0.2} />
      <Node x={128} y={70} w={68} h={58} label="Model" delay={0.28} accent />
      <Wire d="M162 70 V38 H244" delay={0.42} />
      <Wire d="M162 128 V162 H244" delay={0.48} />
      <Wire d="M196 99 H244" delay={0.54} />
      <Node x={244} y={22} w={64} h={32} label="Actions" delay={0.6} />
      <Node x={244} y={83} w={64} h={32} label="Answers" delay={0.66} />
      <Node x={244} y={146} w={64} h={32} label="Your data" delay={0.72} />
    </Frame>
  );
}

/** 02 — a browser over the strata that actually make it work. */
function WebApplications() {
  return (
    <Frame>
      <motion.g {...pop(0.05)}>
        <rect
          x={40}
          y={16}
          width={240}
          height={64}
          rx={3}
          fill="transparent"
          stroke="var(--hairline-strong)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={40}
          y1={34}
          x2={280}
          y2={34}
          stroke="var(--hairline)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={50} cy={25} r={2.5} fill="var(--hairline-strong)" />
        <circle cx={59} cy={25} r={2.5} fill="var(--hairline-strong)" />
        <circle cx={68} cy={25} r={2.5} fill="var(--hairline-strong)" />
      </motion.g>

      <Wire d="M160 80 V100" delay={0.24} />
      <Node x={40} y={100} w={72} h={30} label="Auth" delay={0.34} />
      <Node x={124} y={100} w={72} h={30} label="API" delay={0.42} accent />
      <Node x={208} y={100} w={72} h={30} label="Jobs" delay={0.5} />
      <Wire d="M76 130 V152 H244 V130" delay={0.6} />
      <Wire d="M160 130 V152" delay={0.62} />
      <Node x={124} y={152} w={72} h={30} label="Database" delay={0.7} />
    </Frame>
  );
}

/** 03 — one product, many tenants, one billing spine. */
function SaasProducts() {
  return (
    <Frame>
      <Node x={12} y={26} w={70} h={30} label="Tenant A" delay={0.05} />
      <Node x={12} y={85} w={70} h={30} label="Tenant B" delay={0.12} />
      <Node x={12} y={144} w={70} h={30} label="Tenant C" delay={0.19} />

      <Wire d="M82 41 H116 V100" delay={0.3} />
      <Wire d="M82 100 H116" delay={0.34} />
      <Wire d="M82 159 H116 V100" delay={0.38} />

      <Node x={116} y={78} w={84} h={44} label="Platform" delay={0.46} accent />

      <Wire d="M200 100 H236" delay={0.58} />
      <Node x={236} y={54} w={72} h={30} label="Billing" delay={0.66} />
      <Node x={236} y={116} w={72} h={30} label="Roles" delay={0.72} />
      <Wire d="M236 69 H218 V131 H236" delay={0.78} />
    </Frame>
  );
}

/** 04 — a grid assembling itself into a page. */
function HighEndWebsites() {
  const blocks = [
    { x: 40, y: 24, w: 240, h: 26, delay: 0.06, accent: false },
    { x: 40, y: 58, w: 148, h: 62, delay: 0.16, accent: true },
    { x: 196, y: 58, w: 84, h: 28, delay: 0.24, accent: false },
    { x: 196, y: 92, w: 84, h: 28, delay: 0.3, accent: false },
    { x: 40, y: 128, w: 74, h: 46, delay: 0.38, accent: false },
    { x: 122, y: 128, w: 74, h: 46, delay: 0.44, accent: false },
    { x: 204, y: 128, w: 76, h: 46, delay: 0.5, accent: false },
  ];

  return (
    <Frame>
      {blocks.map((block) => (
        <motion.rect
          key={`${block.x}-${block.y}`}
          x={block.x}
          y={block.y}
          width={block.w}
          height={block.h}
          rx={3}
          fill={block.accent ? "var(--accent-contextual)" : "var(--hairline)"}
          fillOpacity={block.accent ? 0.14 : 1}
          stroke={
            block.accent ? "var(--accent-contextual)" : "var(--hairline-strong)"
          }
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0, y: block.y + 14, scaleX: 0.92 }}
          animate={{ opacity: 1, y: block.y, scaleX: 1 }}
          transition={{ duration: 0.6, delay: block.delay, ease: EASE }}
          style={{ originX: `${block.x + block.w / 2}px` }}
        />
      ))}
    </Frame>
  );
}

/** 05 — scattered tools converging into one system. */
function CustomSoftware() {
  return (
    <Frame>
      <Node x={10} y={18} w={68} h={28} label="Sheets" delay={0.05} />
      <Node x={10} y={86} w={68} h={28} label="CRM" delay={0.11} />
      <Node x={10} y={154} w={68} h={28} label="Email" delay={0.17} />

      <Wire d="M78 32 H112 V86" delay={0.28} />
      <Wire d="M78 100 H112" delay={0.32} />
      <Wire d="M78 168 H112 V114" delay={0.36} />

      <Node x={112} y={78} w={80} h={44} label="One system" delay={0.46} accent />

      <Wire d="M192 100 H232" delay={0.58} />
      <Node x={232} y={86} w={76} h={28} label="Operations" delay={0.66} />

      <motion.circle
        cx={270}
        cy={56}
        r={4}
        fill="var(--accent-contextual)"
        {...pop(0.76)}
      />
      <motion.circle
        cx={270}
        cy={146}
        r={4}
        fill="var(--accent-contextual)"
        fillOpacity={0.5}
        {...pop(0.82)}
      />
      <Wire d="M270 60 V86" delay={0.8} />
      <Wire d="M270 114 V142" delay={0.84} />
    </Frame>
  );
}

/** Keyed by `BuildCategory.index` so the data file stays the ordering authority. */
export const buildSchematics: Record<string, () => React.JSX.Element> = {
  "01": AiProducts,
  "02": WebApplications,
  "03": SaasProducts,
  "04": HighEndWebsites,
  "05": CustomSoftware,
};
