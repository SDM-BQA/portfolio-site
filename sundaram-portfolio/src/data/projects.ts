export type ProjectLink = { label: string; href: string };

export type ProjectSection = {
  heading: string;
  body?: string;
  items?: string[];
  flow?: string[];
};

export type Project = {
  slug: string;
  name: string;
  category: "Professional work" | "Personal project";
  period: string;
  summary: string;
  stack: string[];
  /** Only links checked against the live destination belong here (FR-011). */
  links: ProjectLink[];
  outcome?: { label: string; text: string };
  note?: string;
  sections: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "helpee",
    name: "Helpee Elder Care",
    category: "Professional work",
    period: "June 2025 – Present",
    summary:
      "Closed cases could still hide unpaid invoices, so I built the verification workflow that catches them, alongside a caregiver PWA and internal dashboards.",
    stack: ["React", "Node.js", "GraphQL", "MongoDB", "AWS", "PWA"],
    links: [],
    outcome: {
      label: "Estimated result",
      text: "An estimated 70–80% reduction in the backlog of unpaid invoices on closed cases.",
    },
    note: "This is professional work, described at a high level. No internal screenshots, source code or customer data are shown.",
    sections: [
      {
        heading: "The operational problem",
        body: "Cases could reach closure with pending invoices, unraised charges or revisions still outstanding. That left a backlog of unpaid invoices on closed cases and a revenue-leakage gap.",
      },
      {
        heading: "The workflow",
        body: "I designed and built a case-closure verification workflow that surfaces outstanding invoices, unraised charges and needed revisions before a case can be closed.",
        flow: ["Care Manager request", "Customer Success review", "Approval"],
      },
      {
        heading: "My contribution",
        items: [
          "Designed and built the case-closure verification workflow.",
          "Own end-to-end development of the caregiver-facing Progressive Web App.",
          "Build and maintain AWS-hosted internal dashboard modules for case management, invoicing and caregiver operations.",
          "Automated daily summary emails and analytics reports with Node.js cron jobs.",
          "Optimised MongoDB queries and GraphQL resolvers to improve dashboard load times and API performance.",
        ],
      },
      {
        heading: "Shipped",
        items: [
          "Case-closure verification workflow.",
          "Caregiver PWA Phase 1: caregiver onboarding, built and shipped independently, with AuthBridge for Aadhaar and background verification and AWS Rekognition for profile-photo verification.",
          "Internal dashboard modules, automated summary emails and analytics reports.",
        ],
      },
      {
        heading: "In progress",
        items: ["Subsequent phases of the caregiver PWA."],
      },
    ],
  },
  {
    slug: "corelog",
    name: "CoreLog",
    category: "Personal project",
    period: "August 2026",
    summary:
      "Tracking media, journaling and expenses usually means several apps and repetitive entries, so CoreLog brings them into one life-logging platform with reusable templates.",
    stack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Leaflet"],
    links: [
      { label: "Live demo", href: "https://dashboard-core-log.vercel.app" },
      { label: "Frontend code", href: "https://github.com/SDM-BQA/CoreLog" },
      { label: "Backend code", href: "https://github.com/SDM-BQA/coreLog_backend" },
    ],
    sections: [
      {
        heading: "Product purpose",
        body: "A personal life-logging platform to track and review movies, series, books and songs alongside a full daily journal.",
      },
      {
        heading: "Media tracking",
        body: "TMDB and Google Books integrations auto-populate metadata such as release year, season and episode counts, and runtime from a single title search.",
      },
      {
        heading: "Journal and custom templates",
        body: 'A custom template engine lets users define reusable journal templates with variables, for example "Read {{pages}} pages of {{book_name}}", removing the need to retype repetitive daily entries.',
      },
      {
        heading: "Geotagging, expenses and views",
        items: [
          "Geotagged journal entries with Leaflet and OpenStreetMap.",
          "An integrated expense tracker, tagging and photo uploads within entries.",
          "Calendar and map views for reviewing entries.",
        ],
      },
      {
        heading: "Technical design",
        body: "MongoDB schemas handle multiple content types (media logs, journal entries and templates) in a single, query-efficient model. The app is deployed on Vercel.",
      },
    ],
  },
  {
    slug: "virtual-mentor",
    name: "Virtual Mentor",
    category: "Personal project",
    period: "November 2025",
    summary:
      "Finding and scheduling time with a mentor is hard to do informally, so Virtual Mentor gives mentors and mentees profiles, session booking and their own dashboards.",
    stack: ["React", "JavaScript", "Node.js", "Express", "MongoDB"],
    links: [{ label: "Source code", href: "https://github.com/SDM-BQA/virtual_mentor_new" }],
    sections: [
      {
        heading: "Product purpose",
        body: "A virtual mentorship web app that connects mentors with mentees and enables online mentor–mentee sessions.",
      },
      {
        heading: "Roles and profiles",
        items: [
          "Mentors create profiles showing their expertise and set their available time slots.",
          "Mentees create profiles, browse mentors and book sessions based on availability.",
          "Separate account types provide role-based access.",
        ],
      },
      {
        heading: "Backend",
        body: "REST APIs built with Express.js handle authentication, session tracking and secure data storage.",
      },
      {
        heading: "Frontend and dashboards",
        body: "A responsive React UI with reusable components and dynamic routing, including dashboards for mentors and mentees to track sessions, progress and communication.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
