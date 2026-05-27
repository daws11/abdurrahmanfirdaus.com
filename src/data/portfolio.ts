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
}

/** A company in the work timeline, grouping one or more roles. */
export interface WorkExperience {
  company: string;
  roles: WorkRole[];
}

export const profile = {
  name: "Abdurrahman Firdaus",
  nickname: "Daus",
  title: "Tech Lead & Full-stack Engineer",
  bio: "I am a Software Engineer with experience in designing, developing, and maintaining high-quality software solutions with 2+ years experience. Proficient in backend and full-stack development, with a strong focus on JavaScript frameworks. Skilled in collaborating with cross-functional teams, identifying and resolving software-related issues, and staying updated with the latest industry trends. Known for boosting project completion, improving code quality, and delivering top-notch user experiences.",
  email: "abdurrahmanfirdaus53@gmail.com",
  location: "Jl. Purbamustika C-55, Arcamanik, Bandung",
  photo: "/assets/images/daws.jpg",
} as const;

export const social = {
  linkedin: "https://www.linkedin.com/in/abdurrahman-firdaus-0a5136302/",
  github: "https://github.com/daws11",
  instagram: "https://www.instagram.com/abdurrahmanfirdauss/",
  whatsapp: "https://wa.me/6285603520775",
  resume:
    "https://drive.google.com/file/d/1x74YWG3ccHtRvtvw0k66npw54lZR-HfK/view?usp=sharing",
} as const;

export const heroHeadline =
  "Full-stack engineer and tech lead. I build products, lead teams, and ship AI that gets things done.";

export const heroSubheadline = "";

export const heroGlitchText = "SOFTWARE ENGINEER";


/** Phrases cycled by the hero "I Am Into …" typewriter. */
export const heroTyping: string[] = [
  "Android Development",
  "Web Development",
  "Full-Stack Engineering",
  "Entrepreneurship",
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
  { name: "Laravel", icon: "https://img.icons8.com/?size=50&id=lRjcvhvtR81o&format=png&color=000000" },
  { name: "Python", icon: "https://img.icons8.com/color/48/000000/python--v1.png" },
  { name: "C++", icon: "https://img.icons8.com/color/48/000000/c-plus-plus-logo.png" },
  { name: "MongoDB", icon: "https://img.icons8.com/color/48/000000/mongodb.png" },
  { name: "MySQL", icon: "https://img.icons8.com/color/48/000000/mysql-logo.png" },
  { name: "PostgreSQL", icon: "https://img.icons8.com/color/48/000000/postgreesql.png" },
  { name: "Heroku", icon: "https://img.icons8.com/color/48/000000/heroku.png" },
  { name: "Netlify", icon: "https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/48/000000/external-netlify-a-cloud-computing-company-that-offers-hosting-and-serverless-backend-services-for-static-websites-logo-shadow-tal-revivo.png" },
  { name: "JQuery", icon: "https://img.icons8.com/ios-filled/48/1169ae/jquery.png" },
];

export interface SkillCategory {
  name: string;
  description: string;
}

export const skillCategories: SkillCategory[] = [
  {
    name: "AI-Powered Development",
    description:
      "Agentic coding, MCP-based integrations, and purpose-built automation agents that replace manual workflows entirely. I've shipped a recruitment AI agent in production — a system that interviews, filters, and routes candidates without human intervention.",
  },
  {
    name: "Full-Stack Delivery",
    description:
      "Full-stack means I own every layer — database schema, RESTful APIs, performant UI. Containerized with Docker, deployed via CI/CD, monitored in production. React, Next.js, Node.js, PostgreSQL — from first migration to live traffic.",
  },
  {
    name: "Systems Integration",
    description:
      "I build the infrastructure that keeps your product running — Docker containers, CI/CD pipelines, and cloud deployments that don't break at the worst moment. I also connect third-party services so your entire stack communicates seamlessly.",
  },
  {
    name: "Technical Leadership",
    description:
      "Leadership isn't a title — it's the work before the work. I write PRDs engineers understand, build roadmaps aligned with business priorities, and run code reviews that raise the bar. The goal is never just velocity — it's a team that knows why they're building.",
  },
];

export const skillsIntro = "How I build";

export const skillsDescription =
  "From AI automation to full-stack delivery — how I take products from first commit to production.";

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
    heading: "Experience",
    subheading: "",
  },
  projects: {
    heading: "Projects",
    subheading: "",
  },
  contact: {
    heading: "Get in touch",
    subheading:
      "Open to freelance, full-time roles, and collaborations.",
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
          "Led end-to-end development of multiple internal web apps (Inventory, Finance & Invoice, an AI-driven Training & Hiring platform, and a Kitchen app). Authored PRDs and weekly roadmaps, ran management calls with senior leadership, and architected real-time integrations (Xero, official WhatsApp API Gateway, SFTP) alongside complex data migrations and automation solutions.",
      },
      {
        position: "Fullstack Developer",
        date: "Aug 2025 – Oct 2025",
        description:
          "Architected and maintained core full-stack systems using Docker, led full-cycle development of 5+ web apps with React, Node.js, and PostgreSQL, implemented automated CI/CD pipelines, and authored API/infrastructure documentation. Promoted to Tech Lead.",
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
          "Developed and maintained scalable full-stack web applications, built proof-of-concept demos and MVPs to support sales and R&D, and deployed/managed applications on Render while collaborating with project leads and designers.",
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
          "Designed and built web and mobile applications (POS cashier apps, warehouse management systems), implemented complex business logic, designed and managed database schemas, and integrated internal and third-party APIs.",
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
          "Built a data-visualization web application for Polda Metro Jaya stakeholders, integrating DKI Jakarta crime data into interactive dashboards with real-time data-processing pipelines.",
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
          "Designed, developed, and maintained software solutions (boosting project completion ~30%), collaborated on 15+ new features, participated in 50+ code reviews, and resolved 100+ software issues.",
      },
    ],
  },
];

/** Education, newest first — rendered by the animated Timeline. */
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

export const educationQuote =
  "Education is not the learning of facts, but the training of the mind to think.";

/** Projects — rendered by the FocusRail 3D carousel. */
export const projects: FocusRailItem[] = [
  {
    id: 1,
    title: "Atto Chat Assistant",
    meta: "AI · Tax",
    description:
      "AI-powered tax assistant tailored for the UAE — clear, accurate answers to tax queries and instant guidance for compliance and filings.",
    imageSrc: "/assets/images/projects/atto.png",
    href: "https://github.com/daws11/chat.taxai",
  },
  {
    id: 2,
    title: "Yosr Voice Assistant",
    meta: "AI · Voice",
    description:
      "AI voice assistant with natural conversations in multiple languages — instant responses and daily-task help through voice commands.",
    imageSrc: "/assets/images/projects/yosr.png",
    href: "https://github.com/daws11/talk.taxai.ae",
  },
  {
    id: 3,
    title: "Tax AI",
    meta: "AI · Enterprise",
    description:
      "AI-powered tax solutions for the UAE region — streamline enterprise tax operations with intelligent, end-to-end capabilities.",
    imageSrc: "/assets/images/projects/taxai.png",
    href: "https://github.com/daws11/tax-ai-wizard-web-70",
  },
  {
    id: 4,
    title: "Hive Project",
    meta: "E-Commerce",
    description:
      "An e-commerce website from PT Telkom's HIPMI UKM, built for the P2MW competition.",
    imageSrc: "/assets/images/projects/hive.png",
    href: "https://github.com/daws11/laravel-ecommerce-example",
  },
  {
    id: 5,
    title: "Crime Dashboard",
    meta: "Data · Dashboard",
    description:
      "Data-visualization web app for Polda Metro Jaya stakeholders, visualizing crime data across DKI Jakarta.",
    imageSrc: "/assets/images/projects/crime.png",
    href: "https://github.com/daws11/bidtik_polda",
  },
  {
    id: 6,
    title: "New Shantika Mobile App",
    meta: "Mobile · Booking",
    description:
      "Mobile application for online ticket booking of PO Bus New Shantika.",
    imageSrc: "/assets/images/projects/shantika.png",
    href: "https://github.com/daws11/admin-panel-Newshantikamobile",
  },
  {
    id: 7,
    title: "Warehouse Management App",
    meta: "Mobile · Inventory",
    description:
      "Mobile application to collect data of goods in warehouse storage for PT Nusa Tech Solution.",
    imageSrc: "/assets/images/projects/warehouse.png",
  },
  {
    id: 8,
    title: "Digital Wedding System",
    meta: "Web · Events",
    description:
      "Online-based digital invitation system — invitation distribution, arrival reservation, souvenir collection, and more.",
    imageSrc: "/assets/images/projects/nikah.png",
    href: "https://github.com/daws11/digital-invitation",
  },
  {
    id: 9,
    title: "Gold Store Management",
    meta: "Web · POS",
    description:
      '"I Love Emas" gold-shop management system with realtime gold-sales calculation and a built-in POS cashier app.',
    imageSrc: "/assets/images/projects/emas.png",
    href: "https://github.com/daws11/I-Love-Emas",
  },
];

/** Anchor sections for the navbar. */
export const navLinks = [
  { label: "Home", href: "#home" },

  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
  { label: "Projects", href: "#work" },
];
