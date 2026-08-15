/**
 * Services detail.
 *
 * Extends the homepage's `buildCategories` with the depth a services page needs.
 * `index`, `title` and `summary` are re-used from that array so the two pages
 * can never drift — only the long-form copy lives here.
 *
 * No outcome, timeline or performance figures are claimed anywhere.
 */

import { buildCategories } from "@/lib/content";
import type { CaseStudySlug } from "@/lib/case-studies";

export type Service = {
  /** Anchor id — also the sidebar target. */
  id: string;
  index: string;
  title: string;
  summary: string;
  headline: string[];
  /**
   * The whole service in one plain sentence, written for someone who does not
   * know what any of these categories mean. This is the line the page leads
   * with; `body` is the detail behind it.
   */
  plain: string;
  /** First person, as a visitor would describe their own problem. */
  bestFor: string;
  body: string[];
  /** What the engagement actually contains. */
  includes: { title: string; body: string }[];
  /** What lands at the end of it. */
  deliverables: string[];
  /** "You probably need this when…" */
  signals: string[];
  caseStudy?: CaseStudySlug;
};

const detail: Record<
  string,
  Omit<Service, "index" | "title" | "summary">
> = {
  "ai-products": {
    id: "ai-products",
    plain:
      "You have work your team repeats every day. We build the AI that takes it over — inside the product, not in a separate tab.",
    bestFor: "We do the same manual work over and over.",
    headline: ["AI that earns", "its place in the product."],
    body: [
      "Most AI features fail for the same reason: they are bolted onto a product instead of designed into a workflow. We start from the task someone repeats every day, decide whether a model genuinely removes work from it, and only then design the interface around it.",
      "That usually means a smaller, more specific feature than a demo would suggest — one that produces a predictable output, shows its progress, and leaves a person in control of the result.",
    ],
    includes: [
      {
        title: "Workflow mapping",
        body: "We follow the real process first — what is repeated, where the time goes, and which step a model can actually take over.",
      },
      {
        title: "Model selection & prompting",
        body: "Choosing between OpenAI, Claude and Gemini on cost, latency and output quality for your specific task, not on brand.",
      },
      {
        title: "Generation UX",
        body: "Visible stages, honest progress and reviewable output. AI features fail on trust long before they fail on quality.",
      },
      {
        title: "Guardrails & fallbacks",
        body: "What happens on a bad response, a timeout, or a rate limit — designed rather than discovered in production.",
      },
      {
        title: "Cost & usage control",
        body: "Token budgets, caching and credit systems so the feature stays economic as usage grows.",
      },
    ],
    deliverables: [
      "AI feature design",
      "Prompt architecture",
      "Model integration",
      "Generation pipeline",
      "Usage & credits",
      "Evaluation harness",
    ],
    signals: [
      "Your team repeats the same manual production work at volume.",
      "You've tried a generic AI tool and it doesn't understand your process.",
      "You need AI inside the product, not a separate tab someone forgets.",
    ],
    caseStudy: "optiora",
  },

  "web-applications": {
    id: "web-applications",
    plain:
      "You need a real application — a portal, a dashboard, a marketplace — that stays fast and clear as it grows.",
    bestFor: "A spreadsheet became our system of record.",
    headline: ["Applications that hold up", "once real people use them."],
    body: [
      "Portals, marketplaces, dashboards and internal platforms have one thing in common: they get slower and more confusing as they grow. That is almost always an architecture problem showing up as a UX problem.",
      "We design the data model and the interface together, so navigation, permissions and state stay coherent when the second and third module arrive.",
    ],
    includes: [
      {
        title: "Information architecture",
        body: "How the product is organised — what lives where, and what a user should never have to search for.",
      },
      {
        title: "Interface & interaction design",
        body: "Screens, states and flows for the paths people take daily, not just the happy path in a pitch.",
      },
      {
        title: "Frontend engineering",
        body: "React and Next.js, typed end to end, built as components your team can extend without us.",
      },
      {
        title: "APIs & integrations",
        body: "Connecting the systems the business already runs on rather than asking it to abandon them.",
      },
      {
        title: "Roles & permissions",
        body: "Who sees what, designed in from the start — retrofitting access control is expensive.",
      },
    ],
    deliverables: [
      "Product architecture",
      "Design system",
      "Next.js frontend",
      "API layer",
      "Auth & roles",
      "Deployment",
    ],
    signals: [
      "A spreadsheet or no-code tool has become the system of record.",
      "Different teams keep the same data in different places.",
      "Adding one feature now breaks two others.",
    ],
  },

  "saas-products": {
    id: "saas-products",
    plain:
      "You want to sell software. We build the first version people can sign up for, pay for and be supported on.",
    bestFor: "I want to sell this as a product.",
    headline: ["From product idea", "to something you can sell."],
    body: [
      "A SaaS product is more than the feature it is named after. It needs onboarding, billing, plan limits, an admin view, and a way to ship changes without breaking paying customers — and those decisions shape the core product more than most founders expect.",
      "We build the first sellable version: narrow enough to launch, structured enough that version two is not a rewrite.",
    ],
    includes: [
      {
        title: "Product strategy & scope",
        body: "What ships first, what waits, and what the first release has to prove.",
      },
      {
        title: "Onboarding & activation",
        body: "The path from sign-up to the moment the product is obviously useful.",
      },
      {
        title: "Subscriptions & billing",
        body: "Plans, limits, trials and upgrades wired to real entitlements in the product.",
      },
      {
        title: "Multi-tenant architecture",
        body: "Data separation, workspaces and roles designed before the first customer, not after.",
      },
      {
        title: "Admin & operations",
        body: "The internal tooling you need to support customers without a developer on call.",
      },
    ],
    deliverables: [
      "Product definition",
      "UX & UI",
      "Subscription logic",
      "Multi-tenant backend",
      "Admin tooling",
      "Infrastructure",
    ],
    signals: [
      "You have a validated idea and need the first real version built.",
      "An internal tool is good enough that customers want to buy it.",
      "Your MVP works but cannot take payment, scale or be supported.",
    ],
    caseStudy: "invoomed",
  },

  "high-end-websites": {
    id: "high-end-websites",
    plain:
      "You need a site that looks like nobody else's and arrives instantly.",
    bestFor: "Our site looks like everyone else's.",
    headline: ["Websites that look considered", "and load like nothing."],
    body: [
      "A marketing site has two jobs: say the right thing, and get out of the way. We treat performance and art direction as the same problem — a beautiful page that arrives late has already lost the visitor it was made for.",
      "We build in Webflow when the site should be editable by a marketing team, and in Next.js when it needs to do more than a template allows. The choice is made per project, not per agency preference.",
    ],
    includes: [
      {
        title: "Positioning & copy direction",
        body: "Deciding what the site has to communicate before deciding how it looks.",
      },
      {
        title: "Art direction",
        body: "A distinct visual language — typography, motion and layout that isn't a theme with your logo on it.",
      },
      {
        title: "Webflow or custom build",
        body: "Webflow for editable marketing sites; Next.js when the site needs custom logic, scale or integrations.",
      },
      {
        title: "Performance & Core Web Vitals",
        body: "Measured, not assumed. Image strategy, font loading and JS budget handled as design constraints.",
      },
      {
        title: "SEO & accessibility",
        body: "Semantic structure, metadata and keyboard support built in rather than audited afterwards.",
      },
    ],
    deliverables: [
      "Art direction",
      "Design system",
      "Webflow / Next.js build",
      "CMS setup",
      "Performance pass",
      "Analytics",
    ],
    signals: [
      "Your site looks like your competitors' because it started from the same template.",
      "Editing a page requires a developer.",
      "The design is fine but the page is slow.",
    ],
  },

  "custom-software": {
    id: "custom-software",
    plain:
      "Your tools don't fit how you work, so people work around them. We build software that fits.",
    bestFor: "Our tools don't fit how we actually work.",
    headline: ["Software shaped around", "how the business runs."],
    body: [
      "Off-the-shelf software asks the business to change to match it. That trade is fine until the workaround becomes the process — a spreadsheet beside the CRM, a second system nobody reconciles, a step that only one person knows.",
      "We map the operation as it actually works, then build the parts that genuinely need to be custom and integrate the rest. Replacing everything is rarely the right answer.",
    ],
    includes: [
      {
        title: "Business analysis",
        body: "Sitting with the people doing the work and documenting the process that really runs, not the one on the org chart.",
      },
      {
        title: "System architecture",
        body: "What becomes one system, what stays separate, and where the boundaries sit.",
      },
      {
        title: "Operations interfaces",
        body: "Dense, fast screens for people who use them all day — keyboard-first, status-clear, low friction.",
      },
      {
        title: "Automation",
        body: "Removing the recurring manual steps: documents, reminders, reconciliation, reporting.",
      },
      {
        title: "Migration",
        body: "Getting existing data in without a gap in operations, and without losing history.",
      },
    ],
    deliverables: [
      "Process mapping",
      "System architecture",
      "CRM / operations platform",
      "Automations",
      "Reporting",
      "Data migration",
    ],
    signals: [
      "Your process lives across several tools that don't talk to each other.",
      "The same information gets typed in more than once.",
      "Generic software forces your team to work in a way that doesn't fit.",
    ],
    caseStudy: "level7",
  },
};

/** Order and shared fields come from the homepage data. */
export const services: Service[] = buildCategories.map((category) => {
  const id = category.title.toLowerCase().replace(/\s+/g, "-");
  const extra = detail[id];

  if (!extra) {
    throw new Error(`Missing service detail for "${id}"`);
  }

  return {
    ...extra,
    index: category.index,
    title: category.title,
    summary: category.summary,
  };
});

/**
 * The four stages of `pipeline`, with one sentence each.
 *
 * Deliberately no durations: the file header commits to claiming no timeline
 * figures, and "2 weeks" on a services page is a promise the sales
 * conversation has to keep.
 */
export const pipelineSteps = [
  {
    stage: "Strategy",
    body: "We work out what the product has to do, who it is for, and what the first version must prove.",
  },
  {
    stage: "Design",
    body: "Structure first, then screens — the architecture and the interface are decided together.",
  },
  {
    stage: "Development",
    body: "Built by the people who designed it, typed end to end, in components your team can extend.",
  },
  {
    stage: "Launch",
    body: "Deployed, measured and handed over — with the access, docs and tooling to run it without us.",
  },
] as const;

/** How an engagement is usually shaped. */
export const engagements = [
  {
    title: "Full product build",
    body: "Strategy through production. We own the outcome end to end and hand over a system your team can extend.",
    fit: "New products, replatforms, first sellable version.",
  },
  {
    title: "Embedded team",
    body: "We join your existing team for a defined period, taking design and frontend or a specific product area.",
    fit: "In-house teams that need senior capacity, fast.",
  },
  {
    title: "Audit & fix",
    body: "A focused review of an existing product — architecture, UX, performance — with a prioritised plan and the fixes applied.",
    fit: "Products that work but have started to slow the business down.",
  },
];
