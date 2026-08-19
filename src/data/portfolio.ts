import type { FocusRailItem } from "@/components/ui/focus-rail";
import type { DemoId } from "@/demos/_index";

export interface ExperienceItem {
  title: string;
  category?: string;
  date?: string;
  description: string;
  status?: "completed" | "current" | "upcoming";
  image?: string;
  /** Optional verification/credential link. */
  href?: string;
}

/** A single position held at a company (a company may have several via promotion). */
export interface WorkRole {
  position: string;
  date: string;
  current?: boolean;
  description: string;
  /** Optional quantified impact line shown under description. */
  impact?: string;
}

/** A company in the work timeline, grouping one or more roles. */
export interface WorkExperience {
  company: string;
  roles: WorkRole[];
}

export const profile = {
  name: "Abdurrahman Firdaus",
  nickname: "Daus",
  title: "Forward Deployed Engineer & Tech Lead",
  bio: "Forward Deployed Engineer based in Bali. I sit with the team, find what's actually broken, ship the smallest fix that unsticks it, and stay until they reach for it without thinking.",
  email: "hello@abdurrahmanfirdaus.com",
  location: "Bali, Indonesia",
  photo: "/assets/images/daws.jpg",
} as const;

export const aboutManifesto =
  "Discover → Design → Deploy → Drive adoption. Repeat until it sticks.";

export const aboutPullQuote =
  "The job isn't done when the code ships — it's done when the team uses it.";

export const social = {
  linkedin: "https://www.linkedin.com/in/abdurrahman-firdaus/",
  github: "https://github.com/daws11",
  instagram: "https://www.instagram.com/abdurrahmanfirdauss/",
  whatsapp: "https://wa.me/6285603520775",
  resume: "https://www.abdurrahmanfirdaus.com/CV.pdf",
} as const;

export const heroGlitchText = "ABDURRAHMAN FIRDAUS";

/** Phrases cycled by the hero "I Am Into …" typewriter. */
export const heroTyping: string[] = [
  "Forward Deployed Engineer",
  "Software Engineer",
  "AI Architect",
];

/** Marquee ticker items shown between sections. */
export const tickerItems: string[] = [
  "Invoice",
  "Reconcile",
  "Inventory",
  "COGS",
  "Stocktake",
  "Finance",
  "People & Culture",
  "WhatsApp Business",
  "Instagram Graph",
  "TikTok",
  "Mastra AI",
  "Teaspoon",
  "iSeller",
  "Xero",
  "n8n",
  "SFTP",
];

export interface Skill {
  name: string;
  icon: string;
}

/** CV-specific summary — condensed from the LinkedIn About section. */
export const resumeSummary =
  "Forward Deployed Engineer based in Bali. I sit with the team, find what's actually broken, ship the smallest fix that unsticks it, and stay until they reach for it without thinking. I lead the Technology & Innovation Lab at PT Unicorn Food and Service, owning end-to-end delivery of every internal product — from PRD and roadmap to real-time integrations and adoption. Five production apps are now in daily use across kitchen, finance, warehouse, HR, and bookings teams. How I work: Discover → Design → Deploy → Drive adoption — I don't write a line of code until I've watched the team do the work by hand.";

export interface SkillGroup {
  label: string;
  items: string[];
}

/** CV-specific grouped skills — mirrors the LinkedIn headline structure. */
export const resumeSkillGroups: SkillGroup[] = [
  { label: "Full-Stack", items: ["React", "Next.js", "TypeScript", "Node.js"] },
  { label: "AI Agents", items: ["n8n", "RAG", "Mastra AI"] },
  {
    label: "Integrations",
    items: ["Xero", "iSeller", "WhatsApp Business API", "Instagram Graph API", "TikTok", "Teaspoon Lab"],
  },
  { label: "Infrastructure", items: ["PostgreSQL", "Docker", "Python"] },
];

/** 12 FDE-aligned skills with hotlinked icons (icons8 CDN). */
export const skills: Skill[] = [
  { name: "TypeScript", icon: "https://img.icons8.com/color/48/000000/typescript.png" },
  { name: "React", icon: "https://img.icons8.com/color/48/000000/react-native.png" },
  { name: "Next.js", icon: "https://img.icons8.com/?size=50&id=AU6Wc7r56Fxz&format=png&color=000000" },
  { name: "Node.js", icon: "https://img.icons8.com/color/48/000000/nodejs.png" },
  { name: "Python", icon: "https://img.icons8.com/color/48/000000/python--v1.png" },
  { name: "PostgreSQL", icon: "https://img.icons8.com/color/48/000000/postgreesql.png" },
  { name: "Docker", icon: "https://img.icons8.com/color/48/000000/docker.png" },
  { name: "Mastra AI", icon: "https://img.icons8.com/?size=50&id=lsPyfDSqWjXu&format=png" },
  { name: "Xero API", icon: "https://img.icons8.com/?size=50&id=9vnjeXF8XR2W&format=png" },
  { name: "WhatsApp Business API", icon: "https://img.icons8.com/color/48/000000/whatsapp--v1.png" },
  { name: "Instagram Graph API", icon: "https://img.icons8.com/?size=50&id=32309&format=png" },
  { name: "Claude Code", icon: "https://img.icons8.com/?size=50&id=NGgNLdW5Zrfu&format=png" },
];

export const sectionCopy = {
  experience: {
    heading: "The trail",
    subheading: "Where I've been useful.",
  },
  work: {
    heading: "Inside the work.",
    subheading: "Nine systems, told in detail. Click any project for the full case study.",
  },
  contact: {
    heading: "Let's build something that gets used.",
    subheading: "Open for full-time roles, fractional CTO engagements, and serious collaborations.",
  },
  about: {
    heading: "About",
    subheading: "Forward Deployed Engineer & Tech Lead · Bali, Indonesia",
  },
} as const;

/** Work experience, newest first — grouped by company (roles show promotions). */
export const experience: WorkExperience[] = [
  {
    company: "PT Unicorn Food and Service",
    roles: [
      {
        position: "Tech Lead",
        date: "Oct 2025 – Present",
        current: true,
        description:
          "Lead the Technology & Innovation Lab: end-to-end FDE ownership of every internal product. Discovery at the desk, not on the whiteboard. PRDs, roadmaps, exec reviews, real-time integrations with Xero, iSeller, Teaspoon Lab, WhatsApp Business, Instagram Graph, TikTok. Promoted from Fullstack Developer to Tech Lead after 2 months for owning shipping velocity and adoption.",
        impact:
          "5 production apps in active use across 6 internal teams (kitchen, finance, PC, warehouse, marketing, ops) — replacing ~6 vendor tools and 4 manual workflows.",
      },
      {
        position: "Fullstack Developer",
        date: "Aug 2025 – Oct 2025",
        description:
          "Joined to containerize the stack. Standardized deployment on Docker + CI/CD so every subsequent ship is one command. Built the first two internal tools before being promoted to Tech Lead.",
        impact:
          "Cut deploy time from ~30 min manual → 90s one-command across 5+ subsequent releases; zero rollback incidents post-standardization.",
      },
    ],
  },
  {
    company: "Datau3",
    roles: [
      {
        position: "Fullstack Developer",
        date: "Jan 2025 – Aug 2025",
        description:
          "Contract engagement at a consulting shop. Built MVPs and PoCs for sales engineering and R&D pipelines, deployed on Render. Short tenure was contract-defined; took the next role when the engagement closed.",
        impact: "4 shipped MVPs, 2 converted to paying pilots.",
      },
    ],
  },
  {
    company: "Digitalinkuy",
    roles: [
      {
        position: "Fullstack Developer",
        date: "Oct 2023 – Jan 2025",
        description:
          "Built POS cashier apps and warehouse management for an F&B SaaS product. Implemented complex schemas, business logic, and third-party API integrations. Left when the company pivoted from product to services and the in-house engineering team was downsized.",
        impact:
          "2 production systems handed to maintenance; 3 major integrations live at handoff (Xero, payment gateway, inventory).",
      },
    ],
  },
  {
    company: "Polda Metro Jaya Crime Dashboard",
    roles: [
      {
        position: "Fullstack Developer",
        date: "Jun 2023 – Nov 2023",
        description:
          "Government contract — built an internal data-visualization dashboard for DKI Jakarta crime data. Project-defined end date; the 5-month tenure was the contract length, not a choice.",
        impact: "Dashboard in continuous use by the requesting unit past contract end.",
      },
    ],
  },
  {
    company: "Bersinar.id",
    roles: [
      {
        position: "Vice-Chief of Tech Department",
        date: "Jan 2021 – Jul 2021",
        description:
          "University engineering organization leadership role. Led a 12-person team across two student-run products while completing a Bachelor's in Software Engineering (Telkom University, 2020–2025).",
        impact: "15+ features shipped, 50+ reviews, ~30% faster cycle time vs prior year.",
      },
    ],
  },
];

/** Education, newest first. */
export const education: ExperienceItem[] = [
  {
    title: "Bachelor of Software Engineering",
    category: "Telkom University",
    date: "2020 – 2025",
    description: "Bachelor's degree in Software Engineering.",
    status: "completed",
    image: "/assets/images/telyu.jpg",
  },
];

/** Certifications. Dates/issuer/credential links sourced from LinkedIn. */
export const certifications: ExperienceItem[] = [
  {
    title: "Certified in Crystal Agile Methodology",
    category: "Udemy",
    date: "Mar 2024",
    description: "Crystal Agile methodology for software delivery.",
    status: "completed",
    href: "https://www.udemy.com/certificate/UC-ea6f2253-83b4-44a0-a1df-8989d36a5bc1/",
  },
  {
    title: "MERN Stack Full-Stack Development Certification",
    category: "Udemy",
    date: "Apr 2024",
    description: "MERN stack certification.",
    status: "completed",
    href: "https://www.udemy.com/certificate/UC-25ed2960-1c58-4af4-9bca-242bfb89634d/",
  },
  {
    title: "Professional Certificate in Project Management",
    category: "MTF Institute of Management, Technology and Finance",
    date: "Jun 2024",
    description: "Professional project management certification.",
    status: "completed",
    href: "https://www.udemy.com/certificate/UC-b27f856c-6ad0-4641-a265-6e6efe2d0118/",
  },
];

export const educationQuote =
  "Education is not the learning of facts, but the training of the mind to think.";

/** Projects — used by static Work grid. */
export const projects: FocusRailItem[] = [
  {
    id: "inv-01",
    title: "Invoice Sense",
    meta: "Finance · Xero · iSeller",
    description:
      "One inbox for every invoice. Auto-cross-checks against Inventory entries and bank balance.",
    imageSrc: "/assets/images/projects/invoice-sense.svg",
    href: "#/demos/invoice-sense",
    privateRepoHref: "https://github.com/PTUNICORN/Invoice-Sense",
    caseStudyId: "invoice-sense",
  },
  {
    id: "inv-02",
    title: "Invenflow",
    meta: "Inventory · Warehouse · Multi-outlet",
    description:
      "Purchasing board, receiving, stocktake, and inter-outlet movement — replaces WhatsApp ops.",
    imageSrc: "/assets/images/projects/invenflow.svg",
    href: "#/demos/invenflow",
    privateRepoHref: "https://github.com/PTUNICORN/invenflow",
    caseStudyId: "invenflow",
  },
  {
    id: "inv-03",
    title: "People & Culture",
    meta: "HR · Workforce",
    description:
      "Internal workforce module for the People & Culture team — onboarding, records, lifecycle.",
    imageSrc: "/assets/images/projects/people-culture.svg",
    href: "#/demos/people-culture",
    privateRepoHref: "https://github.com/PTUNICORN/people-and-culture-app",
    caseStudyId: "people-culture",
  },
  {
    id: "inv-04",
    title: "Kitchen Fresh",
    meta: "Kitchen · Outlet ops",
    description:
      "Daily kitchen ops for outlets — built alongside the kitchen team, not for them.",
    imageSrc: "/assets/images/projects/kitchen-fresh.svg",
    href: "#/demos/kitchen-fresh",
    privateRepoHref: "https://github.com/PTUNICORN/kitchen-fresh",
    caseStudyId: "kitchen-fresh",
  },
  {
    id: "inv-05",
    title: "Channelflow",
    meta: "Booking · AI Agent · Mastra",
    description:
      "This is Bali reservations across WhatsApp, IG, Email, TikTok — with a tour-guide commission track.",
    imageSrc: "/assets/images/projects/channelflow.svg",
    href: "#/demos/channelflow",
    privateRepoHref: "https://github.com/PTUNICORN/channelflow",
    caseStudyId: "channelflow",
  },
  {
    id: "laguku",
    title: "Laguku",
    meta: "Music · AI · WhatsApp",
    description:
      "GPT writes the lyrics, Suno composes the track — delivered via WhatsApp for personal gifting.",
    imageSrc: "/assets/images/projects/laguku.png",
    href: "https://laguku.co",
    caseStudyId: "laguku",
  },
  {
    id: "taxai-wizard",
    title: "TaxAI Wizard",
    meta: "Tax AI · Stripe · 7-step funnel",
    description:
      "Stripe-backed UAE tax onboarding — email → OTP → personal info → plans → checkout → dashboard.",
    imageSrc: "/assets/images/projects/taxai-wizard.png",
    href: "#/demos/taxai-wizard",
    caseStudyId: "taxai-wizard",
  },
  {
    id: "taxai-chat",
    title: "TaxAI Chat",
    meta: "Tax AI · Document Q&A",
    description:
      "Conversations with the UAE tax code — upload, reference, cite. GPT-4o answers with sources.",
    imageSrc: "/assets/images/projects/taxai-chat.png",
    href: "#/demos/taxai-chat",
    caseStudyId: "taxai-chat",
  },
  {
    id: "taxai-talk",
    title: "TaxAI Talk",
    meta: "Tax AI · Voice · ElevenLabs",
    description:
      "GPT reasons, ElevenLabs speaks — tax answers in multiple languages over a live voice channel.",
    imageSrc: "/assets/images/projects/taxai-talk.png",
    href: "#/demos/taxai-talk",
    caseStudyId: "taxai-talk",
  },
];

/** Detailed narrative for a single project page (and the home ringkas card). */
export interface ProjectStory {
  id: DemoId;
  projectHref: string;
  division: string;
  kicker: string;
  fdeCallout: string;
  story: string;
  impact: { label: string; value: string }[];
  outcomes: string[];
  stack: string[];
  integrations: string[];
  heroSrc: string;
  duration: string;
  teamSize: string;
}

/** Narrative for the 5 highlighted projects. Order is homepage order. */
export const projectStories: ProjectStory[] = [
  {
    id: "invoice-sense",
    projectHref: "https://github.com/PTUNICORN/Invoice-Sense",
    division: "Finance",
    kicker: "Two weeks at the finance desk. Then a single screen.",
    fdeCallout:
      "I didn't write a line of code until I'd watched the team reconcile three weeks of invoices by hand. The product wasn't the bottleneck — the trust in the data was.",
    story:
      "**Discovery.** The finance team had three browser tabs open at all times — Xero, the Inventory App, and a manual spreadsheet — and they were cross-referencing invoice numbers by eye. Each purchase meant five minutes of squinting. Each day meant forty purchases. We sat together for two weeks before I opened my editor.\n\n**Built.** Invoice Sense pulls every invoice from purchasing into a single inbox, runs a cross-check against the matching Inventory entry in real time, and reconciles the resulting figure against the Xero ledger. iSeller events feed in POS-side payments so the bank side of the story is never a manual entry. Mismatches are flagged with the exact field that disagrees, not just a red dot.\n\n**Outcome.** Reconciliation collapsed from a multi-day spreadsheet exercise into a single screen per day. Finance stopped chasing tabs and started closing books. The team reaches for Invoice Sense before they reach for Xero.",
    impact: [
      { label: "Reconciliation", value: "4h → 10m / day, finance team of 3+" },
      { label: "Annual hours saved", value: "~1,200h/year (6-day work week)" },
    ],
    outcomes: [
      "Replaced three-tab reconciliation with a single inbox view",
      "Real-time cross-check between purchasing, inventory, and Xero ledger",
      "Field-level mismatch surfacing instead of red-dot guessing",
    ],
    stack: ["Next.js", "TypeScript", "Xero API", "PostgreSQL"],
    integrations: ["Xero", "iSeller"],
    heroSrc: "/assets/images/demos/invoice-sense.png",
    duration: "Aug 2025 – present",
    teamSize: "Solo",
  },
  {
    id: "invenflow",
    projectHref: "https://github.com/PTUNICORN/invenflow",
    division: "Purchasing · Warehouse · Outlets",
    kicker:
      "The most complex thing I've shipped. Built by sitting in the warehouse, not by drawing on a whiteboard.",
    fdeCallout:
      "Stocktake was happening on paper, on WhatsApp, and in three different spreadsheets across five outlets. The system wasn't broken — there was no system.",
    story:
      "**Discovery.** Asset and COGS numbers drifted between warehouse, finance, and the five outlets every week. Nobody was at fault — the work itself was on paper and in chat threads, and the human translation between the two was where the numbers went missing. I spent a week watching the warehouse manager do a stocktake by hand before I drew a single screen.\n\n**Built.** Invenflow is five boards in one. **Purchasing** — a kanban with New → Approve → Purchase, where each item carries an expense / asset / COGS tag so finance books it correctly on the way in. **Receiving** — purchased items land here automatically, ready for the warehouse or outlet to mark received. **Inventory** — a real-time aggregate across every outlet and the warehouse, broken down by asset / stock / COGS / consumable. **Movement** — the warehouse manager's tool for moving stock between locations, so the on-screen numbers stay aligned with what's actually on the shelf. **Stock Take** — outlet-by-outlet count that becomes the next day's baseline. Teaspoon Lab sits underneath for COGS continuity.\n\n**Outcome.** Real-time stock truth across 5 outlets and 1 warehouse. Finance, warehouse, and outlet staff all see the same number at the same time. The next stocktake isn't an event — it's a routine.",
    impact: [
      { label: "Stocktake time", value: "30 min → 2 min / outlet" },
      { label: "Hours saved / week", value: "~16h (daily stocktake, 5 outlets)" },
      { label: "COGS drift", value: "weekly → real-time" },
    ],
    outcomes: [
      "Replaced paper + WhatsApp + 3 spreadsheets with one inventory system",
      "Real-time stock truth across 5 outlets and 1 warehouse",
      "Tag-on-purchase flow (asset / stock / COGS / consumable) wired to finance",
      "Stocktake demoted from event to routine",
    ],
    stack: ["React", "TypeScript", "PostgreSQL", "Teaspoon Lab API"],
    integrations: ["Teaspoon Lab"],
    heroSrc: "/assets/images/demos/invenflow.png",
    duration: "Aug 2025 – present",
    teamSize: "Solo",
  },
  {
    id: "channelflow",
    projectHref: "https://github.com/PTUNICORN/channelflow",
    division: "This is Bali · Restaurant ops",
    kicker:
      "Four inboxes. One AI agent. Zero humans in the loop for the booking flow.",
    fdeCallout:
      "We started with rule-based NLP. The migration to Mastra AI taught me what adoption actually means when the customer — not the team — is the user.",
    story:
      "**Discovery.** This is Bali took reservations over WhatsApp, Instagram DMs, email, and TikTok. Four inboxes, no unified state, and a separate spreadsheet for tour-guide commission. The host had to ask the same question — date, time, party size — on every channel. Sometimes twice.\n\n**Built.** Channelflow has three pieces. **Landing pages** for This is Bali and Açai Queen with a web booking flow. **An AI booking agent built on Mastra AI** that lives inside WhatsApp Business, Instagram Graph, Email, and TikTok DMs — handles booking, cancellation, and modification in one conversation. **A tour-guide track** — anyone flagged as a tour guide gets a separate commission ledger, with 10% auto-applied to groups of more than 6. One queue, one source of truth, four doors in.\n\n**Outcome.** The four inboxes collapsed into one queue that the host reads in the morning. Tour-guide commission is automatic — no more end-of-month spreadsheet reconciliation. The AI handles the booking flow without a human in the loop, and the team stopped second-guessing which channel a message came from.",
    impact: [
      { label: "Manual messages", value: "~50+ / day → 0" },
      { label: "Commission reconciliation", value: "monthly → 0" },
      { label: "Channels", value: "4 → 1 queue" },
    ],
    outcomes: [
      "Four inbound channels unified into a single queue",
      "AI booking agent handles reservation flow end-to-end via Mastra AI",
      "Tour-guide commission ledger auto-applied (10% on groups of 6+)",
      "Host reads one morning queue instead of four inboxes",
    ],
    stack: [
      "Mastra AI",
      "Next.js",
      "TypeScript",
      "WhatsApp Business API",
      "Instagram Graph API",
    ],
    integrations: [
      "WhatsApp Business",
      "Instagram Graph",
      "Email",
      "TikTok",
      "Mastra AI",
    ],
    heroSrc: "/assets/images/demos/channelflow.png",
    duration: "Oct 2025 – present",
    teamSize: "Solo + 1 booking",
  },
  {
    id: "kitchen-fresh",
    projectHref: "https://github.com/PTUNICORN/kitchen-fresh",
    division: "Kitchen · Outlet Ops",
    kicker: "Three weeks with the head chef and finance. Then one dashboard that runs the kitchen and the books in the same breath.",
    fdeCallout:
      "I didn't sit down to build a dashboard until I understood why purchasing was running on yesterday's guess and finance was closing the month on a different number than the kitchen was cooking against. The product wasn't a dashboard — it was a shared number.",
    story:
      "**Discovery.** Sales lived in iSeller. Prep lists lived in Teaspoon Lab. COGS lived in finance spreadsheets. Each team was making decisions from their own number, and the numbers disagreed more often than they agreed. I sat with the head chef and the finance lead for three weeks before I opened my editor — watching the morning prep run, watching the closing reconciliation, watching the daily purchase order get drafted against a number from yesterday because today's wasn't ready yet.\n\n**Built.** Kitchen Fresh bridges iSeller and Teaspoon Lab into one real-time dashboard. Sales per outlet, COGS per outlet, and margin per outlet — visible the same day, on the same screen. The head chef sees usage from yesterday and writes tomorrow's purchase order from it; finance sees margin without waiting for a manual reconciliation pass; when ingredient costs shift, the menu prices shift to match because the cost side is on the same dashboard as the price side.\n\n**Outcome.** Purchasing orders now track yesterday's actual usage, not yesterday's guess. Margin is visible per outlet, per day, from one screen. When ingredient costs change, menu prices can move in the same place the team is already looking. The head chef drafts next month's production plan against the same numbers finance is closing against.",
    impact: [
      { label: "Margin visibility", value: "manual/ad-hoc → daily" },
      { label: "Outlets", value: "5 on one screen" },
    ],
    outcomes: [
      "iSeller sales + Teaspoon Lab usage unified into one real-time dashboard",
      "Per-outlet margin visible without manual reconciliation pass",
      "Daily purchase order driven by yesterday's actual usage, not yesterday's guess",
      "Menu pricing can move with ingredient costs on the same surface",
      "Head chef plans the next month from the same numbers finance closes against",
    ],
    stack: ["React", "TypeScript", "Teaspoon Lab API", "iSeller API", "PostgreSQL"],
    integrations: ["iSeller", "Teaspoon Lab"],
    heroSrc: "/assets/images/demos/kitchen-fresh.png",
    duration: "Aug 2025 – present",
    teamSize: "Solo",
  },
  {
    id: "people-culture",
    projectHref: "https://github.com/PTUNICORN/people-and-culture-app",
    division: "HR · Workforce",
    kicker: "HR cost was scaling with headcount. So we replaced the vendor.",
    fdeCallout:
      "I sat with HR for a week and watched them reconcile a forgotten clock-out into an overtime claim — a two-day back-and-forth between one employee and the People Ops team because the system couldn't tell the difference. The product wasn't the HR app. It was the missing tap.",
    story:
      "**Discovery.** The third-party HRM bill was scaling with every new hire — fifteen million rupiah a month and climbing. That wasn't the only problem, but it was the one the stakeholders put on the table first. I sat with HR for a week to understand what was actually inside the rental app we were paying for: onboarding, attendance, shift scheduling, payroll, training, announcements. The list was clear and the requirements were straightforward — until I watched HR reconcile a forgotten clock-out into an overtime claim, a two-day back-and-forth between one employee and the People Ops team because the system couldn't tell the difference.\n\n**Built.** PeopleOS is end-to-end HRM, in-house. Hiring → onboarding → employee records → geofenced clock-in/clock-out with GPS → shift swap and day-off requests → announcements → training (video + quiz, HR-scored) → payroll + overtime, all driven from a shift schedule admin can build with AI assistance or fully by hand (including split shifts, because hospitality doesn't take Sundays off). Admins run it from a web console; employees use a mobile app distributed via Apple App Store unlisted and Google Play private channel, mandatory install. Geofences are admin-defined — employees can only clock-in from inside the circle.\n\n**Outcome.** The vendor bill is gone. Headcount growth no longer drags an HRM line with it. But the bigger shift is operational: HR stopped reconciling forgotten clock-outs into overtime claims because the app now catches them — if an employee exits the geofence without clocking out, the app pings them so they can clock out from outside the circle within a grace window. No more two-day email threads over a forgotten tap.",
    impact: [
      { label: "HRM spend", value: "IDR 15jt/mo → IDR 0" },
      { label: "Annual savings", value: "IDR 180jt / yr" },
      { label: "Headcount", value: "scales without cost" },
    ],
    outcomes: [
      "In-house HRM replaces third-party bill that scaled with every hire",
      "End-to-end lifecycle: hiring, onboarding, records, attendance, shifts, training, payroll",
      "Geofenced clock-in/out with mandatory mobile install (App Store unlisted, Play private)",
      "AI-assisted shift scheduling plus fully custom splits for hospitality",
      "Forgot-to-clock-out notifications cut a recurring HR reconciliation loop",
    ],
    stack: ["React", "Next.js", "TypeScript", "React Native", "PostgreSQL"],
    integrations: [],
    heroSrc: "/assets/images/demos/people-culture.png",
    duration: "Aug 2025 – present",
    teamSize: "Solo",
  },
  {
    id: "laguku",
    projectHref: "https://laguku.co",
    division: "Music · AI orchestration",
    kicker: "A song in their voice, from their story.",
    fdeCallout:
      "The work didn't start with a feature list. I started with the WhatsApp thread where my friend was trying to send his mom a song for her 60th — and couldn't find one in three hours. The product wasn't missing. The delivery was. What you see in the live capture below is what that delivery-first instinct became — a WhatsApp-only surface where the song itself was the gift.",
    story:
      "**Discovery.** Personal gifting — birthdays, anniversaries, retirements — has always been a high-emotion, low-tool moment. People default to a Spotify playlist link, or a YouTube cover, or a generic AI song from a chatbot. None of it sounds like the person it's for. None of it is delivered in a way the recipient will actually open.\n\n**Built.** Laguku orchestrates three things in one WhatsApp-first flow. **GPT** writes the lyrics — prompt-engineered with the customer's story (recipient name, occasion, the relationship, the tone). **Suno** (via kai.ai) composes the actual track from those lyrics, with a small set of curated styles. **WhatsApp Business API** is the delivery surface — the customer never leaves chat, the recipient gets the song the same way they'd get a voice note. No app install, no web flow to abandon, no email to forget.\n\n**Outcome.** Custom songs went from a 3-hour ordeal to a 10-minute WhatsApp conversation. The recipient gets a song that actually mentions their name, their relationship, and the occasion — in a voice and style the customer picked. The product sells itself through the message it leaves in the recipient's chat.",
    impact: [
      { label: "Time to song", value: "3h → 10min in WhatsApp" },
      { label: "Pipeline", value: "GPT → Suno → WhatsApp, fully orchestrated" },
      { label: "Delivery", value: "100% via WhatsApp Business" },
    ],
    outcomes: [
      "GPT-orchestrated lyric generation from the customer's story",
      "Suno composition via kai.ai with curated style prompts",
      "End-to-end WhatsApp Business delivery — no app install required",
      "10-minute flow replaces 3-hour ordeal for personal gifting moments",
    ],
    stack: ["React", "Vite", "TypeScript", "OpenAI", "Suno", "WhatsApp Business API"],
    integrations: ["WhatsApp Business", "OpenAI", "kai.ai"],
    heroSrc: "/assets/images/demos/laguku.png",
    duration: "2024 – present",
    teamSize: "Solo + brand operator",
  },
  {
    id: "taxai-wizard",
    projectHref: "https://github.com/daws11/tax-ai-wizard-web-70",
    division: "Tax AI · Stripe subscription",
    kicker: "From Free Trial to Yearly — a Stripe-powered onboarding for the UAE tax assistant.",
    fdeCallout:
      "The real engineering challenge wasn't the Stripe integration. It was the seven screens in between — email, OTP, personal info, plan selection, checkout, success, dashboard — each one a place the customer could drop off. I rebuilt the funnel because the existing one was losing them at step two.",
    story:
      "**Discovery.** TaxAI needed a 7-step onboarding that moved a UAE tax customer from a free trial to a paid subscription without friction. The existing flow had seven steps but no visible state — the customer didn't know they were on step three of seven, didn't know what was coming next, and dropped off at the OTP screen because nothing told them to check their inbox.\n\n**Built.** A linear funnel: **Email** (work email only — personal emails blocked) → **OTP** (6-digit code, auto-advance inputs, resend) → **Personal info** (name, job title, country) → **Plan selection** (4 tiers, Free Trial / Monthly / Quarterly / Yearly) → **Checkout** (Stripe Elements with VAT breakdown + AED/USD currency) → **Success** (welcome screen with subscription summary) → **Dashboard** (quota widget, subscription status, renewal date). The stepper sidebar tells the customer where they are, which steps are done, and what's next.\n\n**Outcome.** The funnel is the product surface. Every step is a place to lose the customer — and every step now has a visible state, a clear next action, and a back path. The Stripe-backed checkout handles the conversion; the seven screens handle the trust.",
    impact: [
      { label: "Steps", value: "7 (Email, OTP, Personal info, Plans, Checkout, Success, Dashboard)" },
      { label: "Plans", value: "4 tiers, AED/USD" },
      { label: "Backbone", value: "Stripe Elements · JWT auth · MongoDB" },
    ],
    outcomes: [
      "7-step onboarding funnel with visible stepper state and completion checkmarks",
      "Stripe Elements checkout with VAT breakdown (5%, UAE) and currency selector",
      "Email → OTP gate using work-domain validation",
      "Welcome screen with subscription summary before dashboard reveal",
      "Multilingual-ready copy (English prototype, AR-ready structure)",
    ],
    stack: ["React", "TypeScript", "Stripe Elements", "MongoDB", "Express", "JWT"],
    integrations: ["Stripe"],
    heroSrc: "/assets/images/demos/taxai-wizard.png",
    duration: "2025 – present",
    teamSize: "Solo + 1 founder",
  },
  {
    id: "taxai-chat",
    projectHref: "https://github.com/daws11/chat.taxai",
    division: "Tax AI · Document Q&A",
    kicker: "Conversations with the UAE tax code — upload, reference, cite.",
    fdeCallout:
      "Users don't want an answer alone. They want an answer they can take to their auditor. Every AI response needs to cite the law it just paraphrased — Federal Decree-Law, Executive Regulations, FTA Public Clarifications. The chat is the product; the citations are the trust.",
    story:
      "**Discovery.** UAE tax questions don't have one source. They have the Federal Decree-Law No. (8) of 2017, the Executive Regulations, FTA Public Clarifications, and sector-specific guides. A consultant answering a VAT question quotes from all four in the same sentence. A chatbot answering a VAT question has to do the same — or it's not useful.\n\n**Built.** A chat interface where every AI response carries citation cards under the bubble. The customer uploads a PDF (invoice, contract, prior return); the assistant reads it; the response quotes the specific law section that applies. Dual-bubble layout — user on the right with an accent background, AI on the left with citations below. Token usage is tracked per conversation and surfaced in the sidebar footer; the monthly quota is visible without leaving the chat. Avatars per bubble, typing indicator before each AI reply, hover-reveal reactions to rate the response quality.\n\n**Outcome.** A consultant can copy the response, drop it in a client email, and defend every line with the source citation underneath. The chat isn't a chatbot — it's a citable research surface.",
    impact: [
      { label: "Citations", value: "Per AI response, with snippet preview" },
      { label: "Sources", value: "Federal Decree-Law, Executive Regulations, FTA Public Clarifications" },
      { label: "Attachments", value: "PDF upload + inline preview per turn" },
    ],
    outcomes: [
      "Citation cards under every AI message — Federal Decree-Law, Executive Regulations, FTA",
      "Dual-bubble layout with per-message avatars and typing indicator",
      "PDF upload + attachment preview inline per turn",
      "Token quota tracked per conversation, visible in sidebar footer",
      "Hover-reveal reactions to rate AI response quality",
    ],
    stack: ["Next.js", "TypeScript", "MongoDB", "JWT"],
    integrations: [],
    heroSrc: "/assets/images/demos/taxai-chat.png",
    duration: "2025 – present",
    teamSize: "Solo",
  },
  {
    id: "taxai-talk",
    projectHref: "https://github.com/daws11/talk.taxai.ae",
    division: "Tax AI · Voice pipeline",
    kicker: "GPT reasons, ElevenLabs speaks — tax answers in multiple languages.",
    fdeCallout:
      "I didn't pick ElevenLabs first. I picked it last — after trying three other TTS pipelines that couldn't handle Arabic without losing the tax terms. Voice is the trust surface for voice products. If the Arabic sounds wrong, the customer stops trusting the English too.",
    story:
      "**Discovery.** TaxAI Talk is a voice-first interface for the same UAE tax corpus. The customer speaks (Arabic or English), GPT-4o reasons over the corpus, ElevenLabs speaks the answer back in the customer's language. The hard part wasn't the reasoning — it was making the voice pipeline hold up across Arabic numerals, transliterated tax terms, and ElevenLabs voice quality at the latency the customer expects from a phone call.\n\n**Built.** A live voice session screen with two avatars (you + TaxAI assistant), a status badge (\"Live\"), a 32-bar pulsing waveform during the call, and a single-tap end-call flow. The transcript view shows the bilingual conversation with per-turn avatars, language pills, and a 'Play audio' button on each AI turn that shows the actual audio duration. The settings panel lets the customer pick from 4 ElevenLabs voices (Aria, River, Sarah, George), each with a 5-second preview button before committing.\n\n**Outcome.** A UAE tax consultant can hand the phone to a client and have the conversation happen in Arabic, with the assistant voice clearly pronouncing every Federal Decree-Law reference. The transcript captures the full exchange with audio playback per turn — the consultant can forward the session link to a colleague without losing the audio.",
    impact: [
      { label: "Pipeline", value: "GPT-4o reasoning + ElevenLabs speech" },
      { label: "Languages", value: "EN, AR, Multilingual" },
      { label: "Voices", value: "4 ElevenLabs voices with preview" },
    ],
    outcomes: [
      "GPT-4o reasons over the UAE tax corpus, ElevenLabs speaks the response",
      "32-bar pulsing waveform during the live session, status badge (\"Live\")",
      "Bilingual transcript with per-turn avatars, language pills, and audio playback",
      "4 ElevenLabs voices (Aria, River, Sarah, George) with 5-second preview per card",
      "Multilingual output handles Arabic numerals and transliterated tax terms",
    ],
    stack: ["Next.js", "TypeScript", "ElevenLabs SDK", "OpenAI"],
    integrations: ["ElevenLabs", "OpenAI"],
    heroSrc: "/assets/images/demos/taxai-talk.png",
    duration: "2025 – present",
    teamSize: "Solo",
  },
];

/** Anchor sections for the navbar (in order of appearance). */
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
