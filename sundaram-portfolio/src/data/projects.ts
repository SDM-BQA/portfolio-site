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
    slug: "schemelens",
    name: "SchemeLens",
    category: "Personal project",
    period: "November 2026",
    summary:
      "Rules for schemes like PM-KISAN and Ayushman Bharat are buried in long English PDFs, so SchemeLens answers questions in English, Hindi or Kannada using only the official documents, with a clickable citation for every claim.",
    stack: ["React", "Node.js", "Express", "MongoDB Atlas", "Vector Search", "Gemini", "Voyage AI"],
    links: [{ label: "Source code", href: "https://github.com/SDM-BQA/scheme-lens" }],
    outcome: {
      label: "Evaluation",
      text: "100% refusal accuracy on a 29-question test set in three languages, and 8/8 live prompt-injection checks passed.",
    },
    note: "Not official or legal advice. The test set is small and the thresholds were tuned on it, so expect lower accuracy on new questions.",
    sections: [
      {
        heading: "The problem",
        body: "Who is eligible, how much is paid and which documents are needed are all public, but spread across long English PDFs. A general chatbot can answer from outdated or invented memory, and for questions about money and eligibility a confident wrong answer is worse than no answer.",
      },
      {
        heading: "How it works",
        body: "A retrieval-augmented generation (RAG) app: it first finds the relevant passages in the official documents, then has the model answer only from those passages and cite each claim.",
        flow: ["Official PDFs", "Section-aware chunks", "Voyage embeddings", "Atlas Vector Search", "Cited Gemini answer"],
      },
      {
        heading: "What users get",
        items: [
          "Grounded answers: every [n] opens the source passage, page and official PDF.",
          "An honest \"not found\": a similarity gate stops off-topic questions before any model call, the model replies NOT_FOUND when the documents can't answer, and an answer with no valid citation is never shown.",
          "English, Hindi and Kannada: questions are answered in the same language from English documents, and the interface switches language too.",
          "A scheme filter to search one scheme or all four (PM-KISAN, PM-JAY, PMAY-G, PMUY).",
        ],
      },
      {
        heading: "Measured, not assumed",
        items: [
          "29 questions written from the PDFs and verified by hand, including 9 paraphrased \"hard\" questions and off-topic ones that must be refused.",
          "Answer correctness rose from 18/25 to 25/25 (hard set 1/8 to 8/8) after tuning; retrieval hit@5 stayed at 25/25.",
          "The fix was the \"not found\" threshold: search already found the right page for paraphrased questions, but a strict gate refused them.",
          "8/8 live prompt-injection checks passed, including planted malicious \"documents\"; in every case the model cited the genuine excerpt, never the planted one.",
        ],
      },
      {
        heading: "Key decisions",
        items: [
          "Chunking by structure (headings, then paragraphs, then list items) so an eligibility list stays with its intro line.",
          "Repairing PDF reading order by reordering whole text blocks, after a simple line sort scrambled a two-column table.",
          "Thresholding on true cosine similarity, after verifying that Atlas reports (1 + cosine) / 2.",
          "Translating Hindi and Kannada questions to English first was measured and not adopted: no accuracy gain, an extra model call, and an off-topic question slipped past the gate.",
        ],
      },
      {
        heading: "How I used AI",
        body: "Built step by step with Claude Code under a written contract: one build step per commit, hard rules such as never fabricating citations, and a log of what the AI generated, what I decided and what went wrong. Writing harder test questions caught a similarity threshold the AI had set too strictly; reading failed rows caught an evaluation that miscounted provider outages as wrong answers.",
      },
      {
        heading: "Limitations",
        items: [
          "A small corpus: 5 documents across 4 schemes, some several years old.",
          "No OCR, so image-only pages are skipped.",
          "The Hindi and Kannada interface text is AI-translated and awaiting native-speaker review.",
          "Free-tier model and embedding providers, with rate limits and occasional busy errors. Not yet deployed.",
        ],
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
