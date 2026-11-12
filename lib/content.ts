/**
 * Single source of truth for homepage content.
 *
 * Positioning: Darly helps companies move beyond the limits of templates, no-code
 * tools and disconnected systems by designing and engineering the next version of
 * their digital product. Every section reinforces that without repeating it.
 */

export const site = {
  name: "Darly",
  wordmark: "darly",
  domain: "darly.agency",
  url: "https://darly.agency",
  email: "dario@darly.agency",
  description:
    "Darly designs and builds scalable websites, SaaS platforms and AI-powered software for companies that have outgrown templates, no-code tools and disconnected systems.",
} as const;

export const nav = [
  { label: "Work", href: "/case-studies" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Capability strip under the hero. */
export const capabilities = [
  "AI Products",
  "SaaS Platforms",
  "Web Applications",
  "Custom Software",
  "High-end Websites",
  "Automation",
] as const;

export const pipeline = ["Strategy", "Design", "Development", "Launch"] as const;

/* ------------------------------------------------------------------
   02 — Hero: the limits → scale morph
------------------------------------------------------------------ */

export const heroLimits = ["Template", "No-code", "Plugin", "Workaround"] as const;
export const heroScale = [
  "Custom UX",
  "AI",
  "API",
  "Data",
  "Automation",
  "Scale",
] as const;

/* ------------------------------------------------------------------
   02 — Hero: the centred offer
------------------------------------------------------------------ */

/**
 * Live availability signal.
 *
 * This is the one line on the page with a shelf life — a stale quarter is
 * worse than no availability line at all — so it lives here as a named
 * constant rather than buried in the component. Update the window when it
 * turns over.
 */
export const heroAvailability = {
  status: "Available for new projects",
  window: "Q1 2026",
} as const;

/** The four things Darly sells, cycled one at a time under the headline. */
export const heroBuilds = [
  "AI products",
  "SaaS platforms",
  "web applications",
  "custom software",
] as const;

/**
 * Deliberately short. Centred under a display headline this has to hold to
 * three lines — a fourth pushes the trust row below the fold on a 768px
 * laptop, which is the one element that has to be seen without scrolling.
 */
export const heroLead =
  "One senior team carries the work from strategy to production — for companies that have outgrown templates and disconnected systems.";

/** One quiet line under the CTAs: who actually answers a scoping call. */
export const heroFounderNote =
  "You'll speak to the people building it — reply within 24 hours.";

/** Lead-in for the wordmark row. The names themselves come from `projects`. */
export const heroTrustedLead = "Shipped in production for";

/**
 * The accessible h1. The visible headline is an aria-hidden reveal animation,
 * so this is the one indexable sentence — versioned here with the rest of the
 * copy rather than inline in the component.
 */
export const heroHeadingSr =
  "Darly designs and builds AI products, SaaS platforms, web applications and custom software — one senior team from strategy to production.";

/* ------------------------------------------------------------------
   04 — What we build
------------------------------------------------------------------ */

export type BuildCategory = {
  index: string;
  title: string;
  summary: string;
  tags: string[];
};

export const buildCategories: BuildCategory[] = [
  {
    index: "01",
    title: "AI Products",
    summary:
      "AI-powered platforms, assistants, workflow automation and intelligent product features.",
    tags: ["AI SaaS", "Assistants", "Automation"],
  },
  {
    index: "02",
    title: "Web Applications",
    summary:
      "Customer portals, marketplaces, internal platforms and complex web applications.",
    tags: ["Portals", "Marketplaces", "Dashboards"],
  },
  {
    index: "03",
    title: "SaaS Products",
    summary:
      "From product strategy and UX to subscription logic, infrastructure and production.",
    tags: ["Product Strategy", "UX", "Infrastructure"],
  },
  {
    index: "04",
    title: "High-end Websites",
    summary:
      "Fast, distinctive websites built with Webflow or custom technology depending on what the project needs.",
    tags: ["Webflow", "Next.js", "Design Systems"],
  },
  {
    index: "05",
    title: "Custom Software",
    summary:
      "CRM systems, operations platforms, management tools and software designed around real business workflows.",
    tags: ["CRM", "Operations", "Integrations"],
  },
];

/* ------------------------------------------------------------------
   05 — Selected work
------------------------------------------------------------------ */

export type Project = {
  index: string;
  name: string;
  category: string;
  year: string;
  description: string;
  capabilities: string[];
  href: string;
  /** Product screenshot in /public/images — filenames are case-sensitive. */
  image: string;
  alt: string;
};

export const projects: Project[] = [
  {
    index: "01",
    name: "Optiora",
    category: "AI Ecommerce Platform",
    year: "2026",
    description:
      "AI-powered software helping ecommerce teams create and manage marketplace product content at scale.",
    capabilities: ["AI", "Product Design", "SaaS", "Development"],
    href: "/case-studies/optiora",
    image: "/images/optiora.webp",
    alt: "The Optiora workspace, generating marketplace product content",
  },
  {
    index: "02",
    name: "Level7",
    category: "Real Estate Operations Platform",
    year: "2025",
    description:
      "Custom software connecting properties, clients, offers, follow-ups and agency operations in one platform.",
    capabilities: ["CRM", "Automation", "UX/UI", "Development"],
    href: "/case-studies/level7",
    image: "/images/Level_7.webp",
    alt: "The Level7 platform, managing properties and client activity",
  },
  {
    index: "03",
    name: "Invoomed",
    category: "Business Management Software",
    year: "2025",
    description:
      "A unified system for invoicing, warehouse workflows, finance and everyday business operations.",
    capabilities: ["Business Software", "Finance", "SaaS", "Development"],
    href: "/case-studies/invoomed",
    image: "/images/Invoomed.webp",
    alt: "The Invoomed platform, showing invoicing and financial overview",
  },
];

/* ------------------------------------------------------------------
   06 — Why Darly
------------------------------------------------------------------ */

export type Reason = {
  index: string;
  title: string;
  body: string;
  /** Rendered as a small animated diagram beside the reason. */
  diagram: { from: string; via: string; to: string; shape: "merge" | "chain" };
};

export const reasons: Reason[] = [
  {
    index: "01",
    title: "Design and engineering together.",
    body: "The people designing the experience understand how it will be built. No handoff between disconnected teams.",
    diagram: { from: "Design", via: "Product", to: "Engineering", shape: "merge" },
  },
  {
    index: "02",
    title: "AI where it creates real value.",
    body: "We use AI to improve products and workflows — not to add features nobody needs.",
    diagram: {
      from: "Manual process",
      via: "AI",
      to: "Automated system",
      shape: "chain",
    },
  },
  {
    index: "03",
    title: "Custom where templates stop working.",
    body: "When Webflow, no-code tools or plugins become the limitation, we extend or replace only what needs to change.",
    diagram: {
      from: "No-code",
      via: "Custom layer",
      to: "Scalable product",
      shape: "chain",
    },
  },
  {
    index: "04",
    title: "One team from strategy to production.",
    body: "Product thinking, UX, frontend, backend, integrations and deployment stay under one roof.",
    diagram: { from: "Strategy", via: "Design · Build", to: "Ship", shape: "chain" },
  },
];

/* ------------------------------------------------------------------
   07 — Watch an idea become a product
------------------------------------------------------------------ */

export const buildEyebrow = "How we work";

export const buildLead =
  "Strategy, design, development and AI — moving together from first idea to final launch.";

/**
 * The six stages, in the order the canvas plays them.
 *
 * `body` is one sentence, deliberately: it sits beside a large numeral in a
 * narrow column, and anything longer competes with the visual it is describing.
 */
export const buildStages = [
  {
    index: "01",
    key: "strategy",
    label: "Strategy",
    body: "Loose ideas, real constraints, and an honest read on what the product has to do.",
  },
  {
    index: "02",
    key: "ux",
    label: "UX",
    body: "Those ideas find an order — structure, flow, and the paths people actually take.",
  },
  {
    index: "03",
    key: "design",
    label: "Design",
    body: "Type, colour and interface arrive as one system, not decoration applied on top.",
  },
  {
    index: "04",
    key: "development",
    label: "Development",
    body: "The design becomes software: real components, real state, real data behind it.",
  },
  {
    index: "05",
    key: "ai",
    label: "AI",
    body: "Intelligence built into the product where it earns its place — never as a demo.",
  },
  {
    index: "06",
    key: "launch",
    label: "Launch",
    body: "Tested, deployed, and running for real users on their own domain.",
  },
] as const;

/** The scraps of thinking a project actually starts from. */
export const buildIdeaNotes = [
  "reduce the manual work",
  "one system, not five",
  "who actually uses this?",
  "orders → invoices",
  "what breaks at scale?",
  "launch in Q2",
] as const;

/* ------------------------------------------------------------------
   08 — Testimonials
------------------------------------------------------------------ */

/**
 * DRAFT COPY — supplied by Darly, pending client sign-off.
 * Replace each `quote` with the approved client wording before launch.
 * No metrics or results are claimed in any of these.
 */
export const testimonials = [
  {
    quote:
      "Darly turned a complicated real-estate workflow into one system our team can actually use every day. Properties, clients, offers and follow-ups finally work together instead of across disconnected tools.",
    company: "Level7",
    role: "Real Estate Platform",
    project: "Level7",
  },
  {
    quote:
      "The product required AI, complex workflows and a simple experience for the user. Darly brought the product design and development together and turned the concept into a platform we could actually launch.",
    company: "Optiora",
    role: "AI Ecommerce Platform",
    project: "Optiora",
  },
  {
    quote:
      "Instead of adapting the business around generic software, Darly built the software around the way the business actually operates. The result is much simpler for the team and easier to scale.",
    company: "Invoomed",
    role: "Business Management Software",
    project: "Invoomed",
  },
] as const;

/* ------------------------------------------------------------------
   09 — Stack
------------------------------------------------------------------ */

export const stackGroups = [
  { group: "AI", items: ["OpenAI", "Claude", "Gemini"] },
  { group: "Frontend", items: ["React", "Next.js", "TypeScript"] },
  { group: "Backend", items: ["Laravel", "Node.js", "Supabase"] },
  { group: "Web", items: ["Webflow"] },
  { group: "Infrastructure", items: ["Cloudflare", "GitHub"] },
  { group: "Design", items: ["Figma"] },
] as const;

/* ------------------------------------------------------------------
   10 — Free website audit
------------------------------------------------------------------ */

export const auditChecks = [
  "UX",
  "Performance",
  "SEO",
  "Accessibility",
  "AI",
  "Automation",
] as const;

export const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
] as const;
