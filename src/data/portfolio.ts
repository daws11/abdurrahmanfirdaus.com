import type { FocusRailItem } from "@/components/ui/focus-rail";
import type { DemoId } from "@/demos/_index";

export interface ExperienceItem {
  title: string;
  category?: string;
  date?: string;
  description: string;
  status?: "completed" | "current" | "upcoming";
  image?: string;
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
  title: "Forward Deployed Engineer & Lead Full-Stack Developer",
  bio: "Forward Deployed Engineer at PT Unicorn Food and Service in Bali. I sit with the team, find what's actually broken, ship the smallest fix that unsticks it, and stay until they reach for it without thinking.",
  email: "hello@abdurrahmanfirdaus.com",
  location: "Bali, Indonesia",
  photo: "/assets/images/daws.jpg",
} as const;

export const aboutManifesto =
  "Discover → Design → Deploy → Drive adoption. Repeat until it sticks.";

export const aboutPullQuote =
  "The job isn't done when the code ships — it's done when the team uses it.";

export const social = {
  linkedin: "https://www.linkedin.com/in/abdurrahman-firdaus-0a5136302/",
  github: "https://github.com/daws11",
  instagram: "https://www.instagram.com/abdurrahmanfirdauss/",
  whatsapp: "https://wa.me/6285603520775",
  resume:
    "https://drive.google.com/file/d/1x74YWG3ccHtRvtvw0k66npw54lZR-HfK/view?usp=sharing",
} as const;

/** Hero copy — FDE positioning. */
export const heroHeadline =
  "I ship into the business — then I sit with the people who use it until adoption sticks.";

export const heroSubheadline =
  "Forward Deployed Engineer at PT Unicorn Food and Service. Five production apps. One kitchen. Five outlets. Solo + agentic, with a single teammate on booking.";

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

/** Headline stat shown beneath the hero. */
export interface Metric {
  value: string;
  label: string;
  detail: string;
  /** Numeric value for count-up animation. Undefined = no count-up. */
  numericValue?: number;
  /** Featured metrics get the hero treatment (large, warm accent). */
  featured?: boolean;
}

export const metrics: Metric[] = [
  {
    value: "5",
    label: "Production apps adopted",
    detail: "Invoice · Inventory · People & Culture · Kitchen Fresh · Channelflow",
    numericValue: 5,
    featured: true,
  },
  {
    value: "5",
    label: "Outlets on one stack",
    detail: "Real-time inventory, finance, and ops in one place",
    numericValue: 5,
  },
  {
    value: "10+",
    label: "Integrations live",
    detail: "Xero · iSeller · Teaspoon · WhatsApp · IG · TikTok · Mastra AI · n8n",
    numericValue: 10,
  },
  {
    value: "1",
    label: "Teammate (booking)",
    detail: "Solo + agentic for the rest. Multi-session Claude Code workflow.",
    numericValue: 1,
  },
];

export interface Skill {
  name: string;
  icon: string;
}

/** 30 skills with hotlinked icons (icons8 / wikimedia CDNs). */
export const skills: Skill[] = [
  { name: "ReactJS", icon: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/000000/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png" },
  { name: "JavaScript", icon: "https://img.icons8.com/color/48/000000/javascript--v1.png" },
  { name: "VueJS", icon: "https://img.icons8.com/?size=50&id=rY6agKizO9eb&format=png&color=000000" },
  { name: "AngularJS", icon: "https://img.icons8.com/?size=50&id=71257&format=png&color=000000" },
  { name: "NextJS", icon: "https://img.icons8.com/?size=50&id=AU6Wc7r56Fxz&format=png&color=000000" },
  { name: "TypeScript", icon: "https://img.icons8.com/?size=50&id=nCj4PvnCO0tZ&format=png&color=000000" },
  { name: "ExpressJS", icon: "https://img.icons8.com/fluency/48/000000/node-js.png" },
  { name: "NodeJS", icon: "https://img.icons8.com/color/48/000000/nodejs.png" },
  { name: "Swift", icon: "https://img.icons8.com/?size=50&id=XH8DlMsSOmWT&format=png&color=000000" },
  { name: "Flutter", icon: "https://img.icons8.com/?size=50&id=pCvIfmctRaY8&format=png&color=000000" },
  { name: "GO", icon: "https://img.icons8.com/?size=50&id=44442&format=png&color=000000" },
  { name: "Redux", icon: "https://img.icons8.com/color/48/000000/redux.png" },
  { name: "Firebase", icon: "https://img.icons8.com/color/48/000000/firebase.png" },
  { name: "Android", icon: "https://img.icons8.com/fluency/48/000000/android-os.png" },
  { name: "MaterialUI", icon: "https://img.icons8.com/color/48/000000/material-ui.png" },
  { name: "TailwindCSS", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/48px-Tailwind_CSS_Logo.png" },
  { name: "HTML5", icon: "https://img.icons8.com/color/48/000000/html-5--v1.png" },
  { name: "CSS3", icon: "https://img.icons8.com/color/48/000000/css3.png" },
  { name: "Java", icon: "https://img.icons8.com/color/48/000000/java-coffee-cup-logo--v1.png" },
  { name: "Kotlin", icon: "https://img.icons8.com/color/48/000000/kotlin.png" },
  { name: "PHP", icon: "https://img.icons8.com/offices/48/000000/php-logo.png" },
  { name: "Laravel", icon: "https://img.icons8.com/?size=50&id=lRjcvhR81o&format=png&color=000000" },
  { name: "Python", icon: "https://img.icons8.com/color/48/000000/python--v1.png" },
  { name: "C++", icon: "https://img.icons8.com/color/48/000000/c-plus-plus-logo.png" },
  { name: "MongoDB", icon: "https://img.icons8.com/color/48/000000/mongodb.png" },
  { name: "MySQL", icon: "https://img.icons8.com/color/48/000000/mysql-logo.png" },
  { name: "PostgreSQL", icon: "https://img.icons8.com/color/48/000000/postgreesql.png" },
  { name: "Heroku", icon: "https://img.icons8.com/color/48/000000/heroku.png" },
  { name: "Netlify", icon: "https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/48/000000/external-netlify-a-cloud-computing-company-that-offers-hosting-and-serverless-backend-services-for-static-websites-logo-shadow-tal-revivo.png" },
  { name: "JQuery", icon: "https://img.icons8.com/ios-filled/48/1169ae/jquery.png" },
];

export const techLogos = [
  { src: "https://svgl.app/library/react_wordmark_light.svg", alt: "React" },
  { src: "https://svgl.app/library/vercel_wordmark.svg", alt: "Vercel" },
  { src: "https://svgl.app/library/typescript.svg", alt: "TypeScript" },
  { src: "https://svgl.app/library/tailwindcss-wordmark.svg", alt: "Tailwind CSS" },
  { src: "https://svgl.app/library/postgresql-wordmark-light.svg", alt: "PostgreSQL" },
  { src: "https://svgl.app/library/nodejs.svg", alt: "Node.js" },
  { src: "https://svgl.app/library/supabase_wordmark_light.svg", alt: "Supabase" },
  { src: "https://svgl.app/library/docker.svg", alt: "Docker" },
  { src: "https://svgl.app/library/github_wordmark_light.svg", alt: "GitHub" },
  { src: "https://svgl.app/library/python.svg", alt: "Python" },
];

export const sectionCopy = {
  experience: {
    heading: "The trail",
    subheading: "Where I've been useful.",
  },
  projects: {
    heading: "Five apps. Five outlets. One kitchen.",
    subheading: "Everything below was built to be used — by finance, warehouse, kitchen, HR, and ops, every day.",
  },
  work: {
    heading: "Inside the work.",
    subheading: "Five systems, told in detail. Click any project for the full case study.",
  },
  contact: {
    heading: "Let's build something that gets used.",
    subheading: "Open for full-time roles, fractional CTO engagements, and serious collaborations.",
  },
  about: {
    heading: "About",
    subheading: "Forward Deployed Engineer & Tech Lead · Bali, Indonesia",
  },
  metrics: {
    heading: "Receipts",
    subheading: "Outcomes, not promises.",
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
          "Lead the Technology & Innovation Lab: end-to-end delivery of every internal product the company runs. PRDs, roadmaps, management calls, real-time integrations.",
        impact:
          "5+ production apps adopted by kitchen, finance, and PC teams. Replaced manual WhatsApp stocktake with real-time Inventory App.",
      },
      {
        position: "Fullstack Developer",
        date: "Aug 2025 – Oct 2025",
        description:
          "Architected and maintained core full-stack systems using Docker. Led full-cycle development of 5+ web apps. Promoted to Tech Lead.",
        impact:
          "Standardized deployment on Docker + CI/CD; one-command releases for every subsequent ship.",
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
          "Developed full-stack web applications, built MVPs and PoC demos for sales and R&D, deployed on Render.",
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
          "Built POS cashier apps and warehouse management systems. Implemented complex business logic, schemas, and third-party API integrations.",
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
          "Data-visualization web app for internal stakeholders, integrating DKI Jakarta crime data into interactive real-time dashboards.",
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
          "Led software delivery, 15+ features, 50+ code reviews, 100+ issues resolved.",
        impact: "Boosted project completion ~30%.",
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
  {
    title: "Associate Degree · Science",
    category: "Al-Multazam Islamic Boarding School",
    date: "2014 – 2020",
    description: "Associate degree with a focus on Science.",
    status: "completed",
    image: "/assets/images/aem.jpg",
  },
];

/** Certifications. */
export const certifications: ExperienceItem[] = [
  {
    title: "Certified in Crystal Agile Methodology",
    category: "Agile",
    date: "Apr 2025",
    description: "Crystal Agile methodology for software delivery.",
    status: "completed",
  },
  {
    title: "MERN Stack Full-Stack Development Certification",
    category: "Engineering",
    date: "Apr 2025",
    description: "MERN stack certification.",
    status: "completed",
  },
  {
    title: "Professional Certificate in Project Management",
    category: "Product",
    date: "Apr 2025",
    description: "Professional project management certification.",
    status: "completed",
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
    caseStudyId: "invoice",
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
  },
  {
    id: "inv-05",
    title: "Channelflow",
    meta: "Booking · AI Agent · Mastra",
    description:
      "Tis Bali reservations across WhatsApp, IG, Email, TikTok — with a tour-guide commission track.",
    imageSrc: "/assets/images/projects/channelflow.svg",
    href: "#/demos/channelflow",
    privateRepoHref: "https://github.com/PTUNICORN/channelflow",
    caseStudyId: "channelflow",
  },
];

/** Case study details for the 3 highlighted projects. */
export interface CaseStudy {
  id: string;
  projectHref: string;
  division: string;
  /** A short, scene-setting kicker — first line the reader sees. */
  kicker: string;
  /** One-line "what I did as FDE here" — pulled into the sidebar. */
  fdeCallout: string;
  /** Markdown-ish narrative with **bold** inline labels for sub-sections. */
  story: string;
  /** Headline outcome numbers — short labels rendered as visual chips. */
  impact: { label: string; value: string }[];
  /** Tech stack chips. */
  stack: string[];
  /** External integrations — rendered as text badges. */
  integrations: string[];
  /** Path to a hero visual (the placeholder SVG for the project). */
  heroSrc: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "invoice",
    projectHref: "https://github.com/PTUNICORN/Invoice-Sense",
    division: "Finance",
    kicker: "Two weeks at the finance desk. Then a single screen.",
    fdeCallout:
      "I didn't write a line of code until I'd watched the team reconcile three weeks of invoices by hand. The product wasn't the bottleneck — the trust in the data was.",
    story:
      "**Discovery.** The finance team had three browser tabs open at all times — Xero, the Inventory App, and a manual spreadsheet — and they were cross-referencing invoice numbers by eye. Each purchase meant five minutes of squinting. Each day meant forty purchases. We sat together for two weeks before I opened my editor.\n\n**Built.** Invoice Sense pulls every invoice from purchasing into a single inbox, runs a cross-check against the matching Inventory entry in real time, and reconciles the resulting figure against the Xero ledger. iSeller events feed in POS-side payments so the bank side of the story is never a manual entry. Mismatches are flagged with the exact field that disagrees, not just a red dot.\n\n**Outcome.** Reconciliation collapsed from a multi-day spreadsheet exercise into a single screen per day. Finance stopped chasing tabs and started closing books. The team reaches for Invoice Sense before they reach for Xero.",
    impact: [
      { label: "From", value: "multi-day" },
      { label: "To", value: "single screen" },
    ],
    stack: ["Next.js", "TypeScript", "Xero API", "PostgreSQL"],
    integrations: ["Xero", "iSeller"],
    heroSrc: "/assets/images/projects/invoice-sense.svg",
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
      { label: "Locations", value: "5 outlets" },
      { label: "Boards", value: "5 in one" },
    ],
    stack: ["React", "TypeScript", "PostgreSQL", "Teaspoon Lab API"],
    integrations: ["Teaspoon Lab"],
    heroSrc: "/assets/images/projects/invenflow.svg",
  },
  {
    id: "channelflow",
    projectHref: "https://github.com/PTUNICORN/channelflow",
    division: "Tis Bali · Restaurant ops",
    kicker:
      "Four inboxes. One AI agent. Zero humans in the loop for the booking flow.",
    fdeCallout:
      "We started with rule-based NLP. The migration to Mastra AI taught me what adoption actually means when the customer — not the team — is the user.",
    story:
      "**Discovery.** Tis Bali took reservations over WhatsApp, Instagram DMs, email, and TikTok. Four inboxes, no unified state, and a separate spreadsheet for tour-guide commission. The host had to ask the same question — date, time, party size — on every channel. Sometimes twice.\n\n**Built.** Channelflow has three pieces. **Landing pages** for Tis Bali and Açai Queen with a web booking flow. **An AI booking agent built on Mastra AI** that lives inside WhatsApp Business, Instagram Graph, Email, and TikTok DMs — handles booking, cancellation, and modification in one conversation. **A tour-guide track** — anyone flagged as a tour guide gets a separate commission ledger, with 10% auto-applied to groups of more than 6. One queue, one source of truth, four doors in.\n\n**Outcome.** The four inboxes collapsed into one queue that the host reads in the morning. Tour-guide commission is automatic — no more end-of-month spreadsheet reconciliation. The AI handles the booking flow without a human in the loop, and the team stopped second-guessing which channel a message came from.",
    impact: [
      { label: "Channels", value: "4 → 1" },
      { label: "Commission", value: "auto" },
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
    heroSrc: "/assets/images/projects/channelflow.svg",
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
      { label: "From", value: "multi-day" },
      { label: "To", value: "single screen" },
    ],
    outcomes: [
      "Replaced three-tab reconciliation with a single inbox view",
      "Real-time cross-check between purchasing, inventory, and Xero ledger",
      "Field-level mismatch surfacing instead of red-dot guessing",
    ],
    stack: ["Next.js", "TypeScript", "Xero API", "PostgreSQL"],
    integrations: ["Xero", "iSeller"],
    heroSrc: "/assets/images/projects/invoice-sense.svg",
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
      { label: "Locations", value: "5 outlets" },
      { label: "Boards", value: "5 in one" },
    ],
    outcomes: [
      "Replaced paper + WhatsApp + 3 spreadsheets with one inventory system",
      "Real-time stock truth across 5 outlets and 1 warehouse",
      "Tag-on-purchase flow (asset / stock / COGS / consumable) wired to finance",
      "Stocktake demoted from event to routine",
    ],
    stack: ["React", "TypeScript", "PostgreSQL", "Teaspoon Lab API"],
    integrations: ["Teaspoon Lab"],
    heroSrc: "/assets/images/projects/invenflow.svg",
    duration: "Aug 2025 – present",
    teamSize: "Solo",
  },
  {
    id: "channelflow",
    projectHref: "https://github.com/PTUNICORN/channelflow",
    division: "Tis Bali · Restaurant ops",
    kicker:
      "Four inboxes. One AI agent. Zero humans in the loop for the booking flow.",
    fdeCallout:
      "We started with rule-based NLP. The migration to Mastra AI taught me what adoption actually means when the customer — not the team — is the user.",
    story:
      "**Discovery.** Tis Bali took reservations over WhatsApp, Instagram DMs, email, and TikTok. Four inboxes, no unified state, and a separate spreadsheet for tour-guide commission. The host had to ask the same question — date, time, party size — on every channel. Sometimes twice.\n\n**Built.** Channelflow has three pieces. **Landing pages** for Tis Bali and Açai Queen with a web booking flow. **An AI booking agent built on Mastra AI** that lives inside WhatsApp Business, Instagram Graph, Email, and TikTok DMs — handles booking, cancellation, and modification in one conversation. **A tour-guide track** — anyone flagged as a tour guide gets a separate commission ledger, with 10% auto-applied to groups of more than 6. One queue, one source of truth, four doors in.\n\n**Outcome.** The four inboxes collapsed into one queue that the host reads in the morning. Tour-guide commission is automatic — no more end-of-month spreadsheet reconciliation. The AI handles the booking flow without a human in the loop, and the team stopped second-guessing which channel a message came from.",
    impact: [
      { label: "Channels", value: "4 → 1" },
      { label: "Commission", value: "auto" },
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
    heroSrc: "/assets/images/projects/channelflow.svg",
    duration: "Oct 2025 – present",
    teamSize: "Solo + 1 booking",
  },
];

/** Anchor sections for the navbar (in order of appearance). */
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
