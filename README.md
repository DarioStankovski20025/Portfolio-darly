# darly.

Homepage for **Darly** — an AI, design and development agency.

> Darly helps companies move beyond the limits of templates, no-code tools and
> disconnected systems by designing and engineering the next version of their
> digital product.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide.

```bash
npm run dev
```

---

## Positioning

The hero anchors it — **Outgrow no-code without starting over** — and every section
below reinforces it: what we build, what we've built, why us, how it comes together.

## Art direction

Swiss editorial structure in cloud white and midnight blue, an electric-blue →
blue-violet signature, and light/dark **chapters** rather than a background
change per section.

| Token | Value | Used for |
| --- | --- | --- |
| `paper` | `#f5f7fa` | cloud white — primary light surface |
| `paper-2` | `#ffffff` | secondary light surface |
| `ink` | `#07111f` | midnight blue — type, dark chapters |
| `ink-2` | `#0d1b2d` | raised dark panels |
| `stack` | `#0a1524` | the stack chapter |
| `void` | `#050c17` | hero, CTA + footer |
| `device` | `#060e1a` | every fake browser/device frame |
| `accent` | `#246bfd` | electric blue — **fills**, dots, borders |
| `accent-ink` | `#1b54d6` | accent **text** on light chapters |
| `accent-2` | `#55b8ff` | sky blue — accent on **dark** chapters |
| `accent-3` | `#685cff` | blue-violet — gradients and glow only |
| `danger` | `#d13c36` | form errors |

The split is forced by contrast, not taste. `accent` lands at ~4.2:1 on cloud
white — right for a 3px dot, short of AA for an 11px mono label — so
`accent-ink` (5.9:1) carries text on light chapters and `accent-2` (8.7:1)
carries it on dark ones. **Never use `text-accent` directly**: use
`text-[var(--accent-contextual)]`, which resolves per chapter.

`--gradient-signature` and the `--glow-*` washes are likewise defined per
chapter, so `.text-gradient`, `.rule-gradient` and `<Bloom>` resolve correctly
on either surface. Dark chapters carry roughly double the glow alpha — the
value that glows on midnight only stains cloud white.

Chapter rhythm alternates the whole way down: hero **dark** → capability light →
what we build **dark** → work light → why **dark** → build light → testimonials
**dark** → stack **dark** → audit light → CTA + footer **dark**. The single
adjacent dark pair is forced from both sides and sits on two different darks.

`components/ui/bloom.tsx` supplies the ambient colour washes (`dawn`, `dusk`,
`halo`, `rise`); its parent needs `relative isolate` plus `overflow-x-clip` —
**not** `overflow-hidden`, which silently kills any `position: sticky`
descendant.

Sections opt into a palette with `.on-dark`, which re-points the contextual tokens
(`--surface`, `--on-surface`, `--hairline`, `--muted-fg`) so shared UI — including the
orbit component — drops into any chapter unmodified.

**Type** — Geist (interface), Geist Mono (labels, indices), Instrument Serif italic
(one emphasised word per headline). All scales use `clamp()`; body runs 16–18px,
lead 17–22px. See `app/globals.css`.

**Motion** — everything eases on `cubic-bezier(0.16, 1, 0.3, 1)`. Durations live in
`lib/motion.ts`: reveals 0.5–0.7s, hovers 0.3s, stagger 0.04–0.06. Nothing makes a
visitor wait to read. Canvases pause offscreen and when the tab is hidden;
`prefers-reduced-motion` disables or shortens every effect.

---

## Structure

```
app/
  layout.tsx            fonts, metadata, OG, intro curtain, custom cursor
  page.tsx              section composition + JSON-LD
  opengraph-image.tsx   generated 1200×630 share image
  robots.ts sitemap.ts
  (case-studies|services|about|contact)/  holding pages

components/
  home/                 the homepage sections, in page order
  ui/
    limits-to-scale.tsx     hero's constrained-grid → connected-system morph
    project-surface.tsx     the three project previews
    cookie-consent.tsx      bottom-right consent card, asked once
    orbiting-circles-02.tsx + orbiting-circles-02-utils/particalsphear.tsx
    interactive-grid.tsx    pointer-reactive canvas field
    velocity-marquee.tsx    marquee that leans into scroll velocity

lib/
  content.ts            ALL copy and data
  brand-icons.ts        brand marks vendored from simple-icons at build time
  motion.ts             easing, durations, stagger
```

## Page order

1. Navbar · 2. Hero · 3. Capability strip · 4. What we build · 5. Selected work ·
6. Why Darly · 7. Build transformation · 8. Client stories · 9. Our stack ·
10. Free website audit · 11. Final CTA · 12. Footer

Proof (client stories) deliberately lands *before* the technical stack.

## Scroll-driven sections

Two sections derive state from scroll. Both compute the active step from
**normalised scroll progress** — never by incrementing a counter from wheel
events, which makes one flick jump several stages.

| Section | Track | Per stage |
| --- | --- | --- |
| Why Darly | 220vh | ~30vh per reason (4) |
| Build transformation | 280vh | ~30vh per stage (6) |

Both drop their sticky track entirely below `lg` and read as vertical sequences.

---

## Content to edit

Everything lives in **`lib/content.ts`**.

- **`testimonials`** — draft copy supplied by Darly, **pending client sign-off**.
  Replace each `quote` with approved wording before launch.
- **`projects`** — real descriptions and capabilities for Optiora, Level7 and
  Invoomed. Project previews are drawn interfaces (`project-surface.tsx`); swap them
  for real screenshots via `next/image` when they are available.
- No metrics, results, awards or client logos are claimed anywhere on the page.
- **The website audit has no backend.** The form runs its real
  connecting/reading/analysing states and then stops at an honest hand-off — it
  never invents a score. Point `runAudit` in `website-audit.tsx` at the real
  endpoint when it exists.

## Notes

- The orbit component is integrated as supplied, with four documented changes in the
  file: locally vendored brand marks, centred rings, evenly distributed icons instead of mirrored
  ones, and category highlighting driven by the legend below it.
- GSAP is not installed. Framer Motion and CSS cover every interaction here.
- Brand marks are vendored locally; `simple-icons` is not a runtime dependency.
  OpenAI has no distributable mark, so it is named in the AI category text rather
  than drawn.
- Scrolling is native — no smooth-scroll library, so keyboard navigation and anchors
  behave normally.
