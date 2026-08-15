/**
 * Case-study content.
 *
 * All copy lives here so it can be edited without touching components.
 *
 * NOTHING in this file claims a number Darly has not verified: no revenue,
 * conversion, time-saving, user-count or award claims appear anywhere. Results
 * are stated qualitatively. Testimonials are DRAFT copy pending client sign-off
 * — replace each `quote` with approved wording before launch.
 *
 * IMAGES: `image: null` renders a reserved placeholder slot at the right aspect
 * ratio. Drop a file into /public/images and set the path — nothing else moves.
 * Filenames are case-sensitive on Linux hosting.
 */

export type CaseStudySlug = "optiora" | "level7" | "invoomed";

export type SlotImage = { src: string; alt: string } | null;

/** One text-and-image beat inside a chapter. */
export type Block = {
  title: string;
  body: string;
  image?: SlotImage;
};

export type Chapter = {
  id: string;
  label: string;
  heading: string[];
  body?: string[];
  blocks?: Block[];
  tags?: string[];
  /** A full-width image closing the chapter. */
  image?: SlotImage;
};

export type CaseStudy = {
  slug: CaseStudySlug;
  index: string;
  name: string;
  category: string;
  year: string;
  /** Drives the hero palette only. */
  theme: "ai" | "estate" | "finance";
  eyebrow: string;
  headline: string[];
  supporting: string;
  meta: { label: string; value: string }[];
  services: string[];
  /** Hero screenshot. */
  image: string;
  alt: string;
  chapters: Chapter[];
  testimonial: { quote: string; company: string; role: string };
  next: { slug: CaseStudySlug; name: string; category: string };
  seo: { title: string; description: string };
};

/* ==================================================================
   01 — OPTIORA
================================================================== */

const optiora: CaseStudy = {
  slug: "optiora",
  index: "01",
  name: "Optiora",
  category: "AI Ecommerce SaaS",
  year: "2026",
  theme: "ai",
  eyebrow: "AI Ecommerce Platform",
  headline: ["Turning ecommerce content", "into an AI-powered workflow."],
  supporting:
    "Optiora is an AI platform built to help ecommerce teams create, improve and manage high-performing marketplace content without relying on fragmented tools and manual creative workflows.",
  meta: [
    { label: "Client", value: "Optiora" },
    { label: "Industry", value: "Ecommerce / AI" },
    { label: "Year", value: "2026" },
    { label: "Role", value: "Strategy · Design · Development" },
  ],
  services: [
    "Product Strategy",
    "UX/UI Design",
    "AI Integration",
    "Full-stack Development",
    "SaaS Architecture",
    "Automation",
  ],
  image: "/images/optiora.webp",
  alt: "The Optiora workspace, generating marketplace product content",
  chapters: [
    {
      id: "overview",
      label: "Overview",
      heading: ["Ecommerce teams don't need", "another image generator."],
      body: [
        "Creating marketplace content involves research, competitor analysis, product positioning, image strategy, visual production, variations, A+ content and repeated revisions. Optiora brings those steps into one product.",
        "Instead of treating AI as a single generation button, the platform was designed around the complete workflow of producing ecommerce content at scale.",
      ],
      tags: ["OpenAI", "Next.js", "Laravel", "MySQL", "Cloud Infrastructure"],
    },
    {
      id: "challenge",
      label: "The challenge",
      heading: ["From fragmented workflow", "to one product."],
      body: [
        "Marketplace teams often move between research tools, spreadsheets, AI tools, image editors, folders and manual review processes just to complete one product listing.",
      ],
      blocks: [
        {
          title: "Too many disconnected tools",
          body: "Research, prompts, imagery and files existed across separate workflows.",
        },
        {
          title: "Creative production didn't scale",
          body: "Producing multiple product images manually becomes expensive and slow across hundreds of SKUs.",
        },
        {
          title: "AI lacked product context",
          body: "Generic AI tools could generate content, but they didn't understand the full marketplace workflow.",
        },
        {
          title: "Agency workflows needed volume",
          body: "The product needed to work not only for one seller, but also for teams managing large catalogs.",
        },
      ],
    },
    {
      id: "build",
      label: "What we built",
      heading: ["One workflow.", "From ASIN to final creative."],
      body: [
        "Darly designed Optiora around the actual steps ecommerce teams take when producing marketplace content — product input, competitor analysis, strategy, generation, A+ content, variations and export.",
      ],
      blocks: [
        {
          title: "Start with the product, not the prompt",
          body: "Users begin with an ASIN, marketplace and product information. Optiora analyses the product context and prepares the foundation for content generation.",
          image: {
            src: "/images/optiora.webp",
            alt: "Optiora product input and generation workspace",
          },
        },
        {
          title: "Product imagery designed around conversion",
          body: "Optiora turns product strategy into marketplace-ready image concepts — secondary images, infographics and lifestyle creative — while preserving the product's core identity.",
          image: null,
        },
        {
          title: "From listing images to complete brand content",
          body: "The same product context extends into A+ content, letting teams build richer marketplace experiences without restarting the creative process from zero.",
          image: null,
        },
        {
          title: "One concept, many products",
          body: "Variation workflows create consistent visual content across multiple product versions while keeping each output organised around its product group.",
          image: null,
        },
        {
          title: "Generated content stays organised",
          body: "Outputs are structured by product, marketplace and content type, so teams find generated, edited and A+ assets without managing folders by hand.",
          image: null,
        },
      ],
    },
    {
      id: "result",
      label: "The result",
      heading: ["What changed", "for the business."],
      blocks: [
        {
          title: "One workflow",
          body: "Product research, content strategy and visual production are connected inside one system.",
        },
        {
          title: "Built for repetition",
          body: "The workflow is designed to be repeated across large product catalogs.",
        },
        {
          title: "AI as infrastructure",
          body: "AI is part of the workflow rather than a separate tool users need to manage.",
        },
      ],
    },
    {
      id: "role",
      label: "Darly's role",
      heading: ["What Darly handled."],
      body: [
        "Strategy through production, in one team — no handoff between a design agency and a development company.",
      ],
      tags: [
        "Product strategy",
        "UX architecture",
        "Interface design",
        "AI workflows",
        "Full-stack development",
        "Generation system",
        "Payments / credits",
        "File management",
        "Product iteration",
      ],
    },
  ],
  testimonial: {
    quote:
      "The product required AI, complex workflows and a simple experience for the user. Darly brought the product design and development together and turned the concept into a platform we could actually launch.",
    company: "Optiora",
    role: "AI Ecommerce Platform",
  },
  next: { slug: "level7", name: "Level7", category: "Real Estate Operations Platform" },
  seo: {
    title: "Optiora — AI Ecommerce Platform | Darly Case Study",
    description:
      "How Darly designed and developed Optiora, an AI-powered ecommerce platform for creating, optimizing and managing marketplace product content at scale.",
  },
};

/* ==================================================================
   02 — LEVEL7
================================================================== */

const level7: CaseStudy = {
  slug: "level7",
  index: "02",
  name: "Level7",
  category: "Real Estate Operations Platform",
  year: "2026",
  theme: "estate",
  eyebrow: "Real Estate Operations",
  headline: ["One platform for the", "entire real estate operation."],
  supporting:
    "Level7 brings properties, clients, offers, follow-ups, financial workflows and everyday agency operations into one custom-built system.",
  meta: [
    { label: "Client", value: "Level7" },
    { label: "Industry", value: "Real Estate" },
    { label: "Year", value: "2026" },
    { label: "Role", value: "Strategy · UX/UI · Development" },
  ],
  services: [
    "Product Strategy",
    "UX/UI Design",
    "CRM Architecture",
    "Business Automation",
    "Custom Software Development",
    "Reporting",
  ],
  image: "/images/Level_7.webp",
  alt: "The Level7 platform, managing properties and client activity",
  chapters: [
    {
      id: "overview",
      label: "Overview",
      heading: ["Real estate isn't one workflow.", "It's dozens happening at once."],
      body: [
        "A property agency manages listings, owners, buyers, offers, follow-ups, documents, finances and internal tasks simultaneously. When those workflows live in separate files and tools, simple operations become unnecessarily difficult.",
        "Level7 was created as one operating system for the agency — designed around how the team actually works.",
      ],
      tags: ["CRM", "Automation", "PDF generation", "Reporting", "AI assistance"],
    },
    {
      id: "challenge",
      label: "The challenge",
      heading: ["Too much information.", "Too many places."],
      blocks: [
        {
          title: "Properties and clients were disconnected",
          body: "Important information could exist across separate workflows rather than one connected system.",
        },
        {
          title: "Follow-ups depended on memory",
          body: "Client communication and next actions needed clearer tracking.",
        },
        {
          title: "Offers required manual work",
          body: "Preparing and managing property offers needed to become faster and more consistent.",
        },
        {
          title: "Management lacked one overview",
          body: "Operational and financial information needed to be visible from one place.",
        },
      ],
    },
    {
      id: "build",
      label: "What we built",
      heading: ["Built around the agency,", "not around generic CRM software."],
      body: [
        "Properties, clients, offers, follow-ups, documents, finance and reporting share the same data — so the answer to an operational question is one click away rather than one spreadsheet away.",
      ],
      blocks: [
        {
          title: "Every property, one clear record",
          body: "Property information, pricing, owners, characteristics and related activity live inside one structured workflow.",
          image: {
            src: "/images/Level_7.webp",
            alt: "Level7 property management interface with client activity",
          },
        },
        {
          title: "From new lead to closed deal",
          body: "The client pipeline gives the team a clear view of where every opportunity stands and what needs to happen next.",
          image: null,
        },
        {
          title: "The next action shouldn't live in someone's memory",
          body: "Follow-ups connect client communication with the rest of the platform, so the team can see who needs attention and why.",
          image: null,
        },
        {
          title: "Turn property data into client-ready offers",
          body: "Property information becomes a structured offer without rebuilding the document manually every time.",
          image: null,
        },
        {
          title: "Operations and numbers in the same system",
          body: "Financial dashboards and reporting give management a clearer picture of agency operations without a separate workflow for every answer.",
          image: null,
        },
        {
          title: "AI where it removes repetition",
          body: "AI-assisted tools help generate property titles, descriptions and keywords, reducing repetitive content work while keeping the team in control.",
          image: null,
        },
      ],
    },
    {
      id: "result",
      label: "The result",
      heading: ["What changed", "for the business."],
      blocks: [
        {
          title: "Connected operations",
          body: "Core agency workflows now live in one platform.",
        },
        {
          title: "Less manual work",
          body: "Repeated operational tasks have structured workflows.",
        },
        {
          title: "Built around the business",
          body: "The software reflects the agency's actual process instead of forcing the team into generic CRM behaviour.",
        },
      ],
    },
    {
      id: "role",
      label: "Darly's role",
      heading: ["What Darly handled."],
      body: [
        "Business analysis through deployment, with the same team holding design and engineering.",
      ],
      tags: [
        "Business analysis",
        "Product architecture",
        "UX flows",
        "UI design",
        "CRM development",
        "Property management",
        "Client pipeline",
        "PDF generation",
        "Finance modules",
        "AI features",
        "Reporting",
        "Deployment",
      ],
    },
  ],
  testimonial: {
    quote:
      "Darly turned a complicated real-estate workflow into one system our team can actually use every day. Properties, clients, offers and follow-ups finally work together instead of across disconnected tools.",
    company: "Level7",
    role: "Real Estate Platform",
  },
  next: { slug: "invoomed", name: "Invoomed", category: "Business Management Software" },
  seo: {
    title: "Level7 — Real Estate Operations Platform | Darly Case Study",
    description:
      "How Darly designed and developed a custom real estate platform connecting properties, clients, offers, follow-ups, finances and agency operations.",
  },
};

/* ==================================================================
   03 — INVOOMED
================================================================== */

const invoomed: CaseStudy = {
  slug: "invoomed",
  index: "03",
  name: "Invoomed",
  category: "Accounting & Business Management Software",
  year: "2026",
  theme: "finance",
  eyebrow: "Business Management Software",
  headline: ["Business operations.", "One system."],
  supporting:
    "Invoomed brings invoicing, warehouse operations, finance, banking, salaries and reporting into one platform designed around the way businesses actually work.",
  meta: [
    { label: "Project", value: "Invoomed" },
    { label: "Industry", value: "Finance / Business Software" },
    { label: "Year", value: "2026" },
    { label: "Role", value: "Strategy · Product Design · Development" },
  ],
  services: [
    "Product Strategy",
    "Business Workflow Design",
    "UX/UI",
    "Custom Software Development",
    "Finance Workflows",
    "Warehouse Management",
    "Reporting",
    "Automation",
  ],
  image: "/images/Invoomed.webp",
  alt: "The Invoomed platform, showing invoicing and financial overview",
  chapters: [
    {
      id: "overview",
      label: "Overview",
      heading: ["Business software shouldn't", "create more administration."],
      body: [
        "Invoices, stock, payments, salaries and financial reporting are deeply connected, but companies often manage them across different tools and manual processes.",
        "Invoomed was designed as one operational platform where those workflows work together instead of competing for attention across multiple systems.",
      ],
      tags: ["Invoicing", "Warehouse", "Banking", "Salaries", "VAT", "Reporting"],
    },
    {
      id: "challenge",
      label: "The challenge",
      heading: ["Different workflows.", "Same business."],
      blocks: [
        {
          title: "Financial information was fragmented",
          body: "Invoices, payments and cash flows needed to be connected.",
        },
        {
          title: "Warehouse activity affected accounting",
          body: "Inventory movements couldn't be treated as a completely separate system.",
        },
        {
          title: "Repeated administration consumed time",
          body: "Common documents and operational processes needed structured workflows.",
        },
        {
          title: "Management needed visibility",
          body: "The system needed to turn operational data into understandable business information.",
        },
      ],
    },
    {
      id: "build",
      label: "What we built",
      heading: ["One platform connecting", "the whole operation."],
      body: [
        "Invoicing, warehouse, finance, salaries, VAT and reporting are modules of one system rather than separate products — so a number in a report can be traced back to the document that created it.",
      ],
      blocks: [
        {
          title: "Every document in one workflow",
          body: "Incoming, outgoing, advance and proforma invoices share one process instead of a separate workflow for each.",
          image: {
            src: "/images/Invoomed.webp",
            alt: "Invoomed invoicing and financial overview interface",
          },
        },
        {
          title: "Inventory connected to the business behind it",
          body: "Warehouse documents, products and stock activity connect with the financial side of the platform instead of existing as an isolated inventory tool.",
          image: null,
        },
        {
          title: "Know where the money is",
          body: "Bank and cash workflows give a clear view of financial activity and connect payments with the rest of the system.",
          image: null,
        },
        {
          title: "Recurring work shouldn't be recurring manual work",
          body: "Salary workflows are structured inside the same platform, keeping recurring financial responsibilities visible and organised.",
          image: null,
        },
        {
          title: "Accounting data without losing context",
          body: "VAT-related workflows and accounting views connect to the operational records that created them, making it easier to understand where the numbers come from.",
          image: null,
        },
        {
          title: "Operations become business visibility",
          body: "Once operational workflows live in one system, management can see patterns that are difficult to spot when data is split across disconnected tools.",
          image: null,
        },
      ],
    },
    {
      id: "result",
      label: "The result",
      heading: ["What changed", "for the business."],
      blocks: [
        {
          title: "One source of operational data",
          body: "Core business workflows are connected instead of isolated.",
        },
        {
          title: "Less administrative friction",
          body: "Common processes have dedicated workflows and consistent interfaces.",
        },
        {
          title: "Designed to expand",
          body: "The architecture allows additional business workflows to join the same system over time.",
        },
      ],
    },
    {
      id: "role",
      label: "Darly's role",
      heading: ["What Darly built."],
      body: [
        "Business workflow mapping through full-stack delivery, handled by one team.",
      ],
      tags: [
        "Product architecture",
        "Business workflow mapping",
        "UX/UI",
        "Invoicing system",
        "Warehouse module",
        "Bank & cash",
        "Salary workflows",
        "VAT workflows",
        "Reminders",
        "Analytics",
        "Reporting",
        "Full-stack development",
      ],
    },
  ],
  testimonial: {
    quote:
      "Instead of adapting the business around generic software, Darly built the software around the way the business actually operates. The result is much simpler for the team and easier to scale.",
    company: "Invoomed",
    role: "Business Management Software",
  },
  next: { slug: "optiora", name: "Optiora", category: "AI Ecommerce Platform" },
  seo: {
    title: "Invoomed — Business Management Software | Darly Case Study",
    description:
      "How Darly designed and developed Invoomed, a unified platform for invoicing, warehouse management, finance and everyday business operations.",
  },
};

export const caseStudies: Record<CaseStudySlug, CaseStudy> = {
  optiora,
  level7,
  invoomed,
};

export const caseStudyList: CaseStudy[] = [optiora, level7, invoomed];

/** Hero palette per project, so each page opens as its own product. */
export const heroTheme = {
  ai: "on-dark bg-ink text-paper",
  estate: "bg-warm",
  finance: "bg-cool",
} as const;
