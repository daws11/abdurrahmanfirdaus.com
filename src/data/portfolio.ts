import type { FocusRailItem } from "@/components/ui/focus-rail";

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
  bio: "Lead Full-Stack Developer and Tech Lead running the Technology & Innovation Lab at This is Bali (PT Unicorn) in Bali. 3+ years shipping production software for hospitality, F&B, and public-sector operations.",
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
export const heroHeadline = "";

export const heroSubheadline = "";

export const heroGlitchText = "ABDURRAHMAN FIRDAUS";

/** Phrases cycled by the hero "I Am Into …" typewriter. */
export const heroTyping: string[] = [
  "Forward Deployed Engineer",
  "Software Engineer",
  "AI Architect",
];

/** Marquee ticker items shown between sections. */
export const tickerItems: string[] = [
  "Inventory",
  "Finance",
  "Training",
  "Hiring",
  "Kitchen",
  "WhatsApp",
  "Xero",
  "SFTP",
  "iSeller",
  "Shopee",
  "Tokopedia",
  "Tspoonlab",
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
    value: "30%",
    label: "Project completion uplift",
    detail: "Across 15+ features, 50+ code reviews, 100+ issues",
    numericValue: 30,
    featured: true,
  },
  {
    value: "5+",
    label: "Apps in production",
    detail: "Inventory, Finance, Training, Kitchen, Hiring",
    numericValue: 5,
  },
  {
    value: "10+",
    label: "Integrations live",
    detail: "Xero · WhatsApp · Vercel · n8n · SFTP",
    numericValue: 10,
  },
  {
    value: "3+",
    label: "Years building internal tools",
    detail: "Hospitality, F&B, and public-sector operations",
    numericValue: 3,
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
    heading: "Things that shipped and stayed shipped.",
    subheading: "Five outlets, one kitchen, one recruitment pipeline. Real systems, real adoption.",
  },
  contact: {
    heading: "Let's build something that gets used.",
    subheading: "Open for full-time roles, fractional CTO engagements, and serious collaborations.",
  },
  about: {
    heading: "About",
    subheading: "Lead Full-Stack Developer & Tech Lead · Bali, Indonesia",
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
    id: 1,
    title: "Atto — Finance & Invoice",
    meta: "Featured",
    description:
      "Real-time Xero dashboard across 5 outlets. Revenue, COGS, profit on demand.",
    imageSrc: "/assets/images/projects/atto.png",
    href: "https://github.com/daws11/chat.taxai",
  },
  {
    id: 4,
    title: "Hive — Recruitment AI Agent",
    meta: "Case study",
    description:
      "AI screening that cut manual CV review from hours to minutes.",
    imageSrc: "/assets/images/projects/hive.png",
    href: "https://github.com/daws11/laravel-ecommerce-example",
  },
  {
    id: 7,
    title: "Warehouse Management",
    meta: "Case study",
    description:
      "Mobile-first app replacing paper-based inventory; loss analytics on demand.",
    imageSrc: "/assets/images/projects/warehouse.png",
    href: "https://github.com/daws11/warehouse-management",
  },
  {
    id: 2,
    title: "Yosr Voice Assistant",
    meta: "AI · Voice",
    description: "Multilingual AI voice assistant.",
    imageSrc: "/assets/images/projects/yosr.png",
    href: "https://github.com/daws11/talk.taxai.ae",
  },
  {
    id: 3,
    title: "Tax AI",
    meta: "AI · Enterprise",
    description: "End-to-end AI tax solutions for the UAE region.",
    imageSrc: "/assets/images/projects/taxai.png",
    href: "https://github.com/daws11/tax-ai-wizard-web-70",
  },
  {
    id: 5,
    title: "Crime Dashboard",
    meta: "Data · Public sector",
    description: "Real-time crime analytics for Polda Metro Jaya.",
    imageSrc: "/assets/images/projects/crime.png",
    href: "https://github.com/daws11/bidtik_polda",
  },
  {
    id: 6,
    title: "New Shantika Mobile",
    meta: "Mobile · Booking",
    description: "Online ticket booking for PO Bus New Shantika.",
    imageSrc: "/assets/images/projects/shantika.png",
    href: "https://github.com/daws11/admin-panel-Newshantikamobile",
  },
  {
    id: 8,
    title: "Digital Wedding System",
    meta: "Web · Events",
    description: "Digital invitation, RSVP, and souvenir collection.",
    imageSrc: "/assets/images/projects/nikah.png",
    href: "https://github.com/daws11/digital-invitation",
  },
  {
    id: 9,
    title: "Gold Store Management",
    meta: "Web · POS",
    description: "Realtime gold-sales calculation with built-in POS.",
    imageSrc: "/assets/images/projects/emas.png",
    href: "https://github.com/daws11/I-Love-Emas",
  },
];

/** Case study details for the 3 showcased projects. */
export interface CaseStudy {
  projectId: number;
  problem: string;
  built: string;
  outcome: string;
  /** Tech stack chips. */
  stack: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    projectId: 1,
    problem:
      "Finance & accounting teams had no real-time visibility into revenue, COGS, and profit across outlets. Every report meant multi-day spreadsheet reconciliation.",
    built:
      "Real-time Xero integration with a centralized dashboard tracking Revenue, COGS, Net Profit, Salaries, and per-outlet metrics. Plus a Stocktake Analytics module for loss tracking.",
    outcome:
      "Live dashboards across 5 outlets. Loss analytics reduced shrinkage by surfacing top-lost items in real time.",
    stack: ["Xero API", "React", "PostgreSQL", "SFTP", "Docker"],
  },
  {
    projectId: 4,
    problem:
      "Hiring was bottlenecked by manual applicant screening. Every role meant hours of CV review and routing by the People & Culture team.",
    built:
      "An AI agent that screens, ranks, and routes applicants, embedded into the recruitment workflow with a unified application surface.",
    outcome:
      "Cut manual screening time per role. Centralized the recruitment workflow into a single app, with a roadmap to fully replace legacy tools.",
    stack: ["Claude", "n8n", "Webhooks", "PostgreSQL"],
  },
  {
    projectId: 7,
    problem:
      "Floor staff had no mobile-friendly way to record warehouse inventory movements. Data sat in paper logs and WhatsApp threads before being entered days later.",
    built:
      "Mobile-first warehouse management app with location-aware stocktake, movement tracking, variance reasons, and analytics on loss by section and item.",
    outcome:
      "Replaced paper-based stocktake with real-time data. Management gets loss-percentage, top-lost items, and variance reason analytics on demand.",
    stack: ["React", "PostgreSQL", "Docker", "SFTP"],
  },
];

/** Anchor sections for the navbar (in order of appearance). */
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
