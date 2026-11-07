/** `core` marks the production stack, shown as large tiles; everything else is listed compactly. */
export type Skill = { name: string; context: string; usedIn: string[]; core?: boolean };
export type SkillGroup = { category: string; skills: Skill[] };

const HELPEE = "Helpee";
const CORELOG = "CoreLog";
const MENTOR = "Virtual Mentor";
const PAIMANA = "Paimana";
const SCHEME = "SchemeLens";
const THIS_SITE = "This site";

/** Project filters for the skills section, with the section each one links to. */
export const skillProjects = [
  { name: HELPEE, href: "#experience" },
  { name: PAIMANA, href: "#projects" },
  { name: SCHEME, href: "#projects" },
  { name: CORELOG, href: "#projects" },
  { name: MENTOR, href: "#projects" },
  { name: THIS_SITE, href: "#home" },
];

/** Context describes where a skill was used; there are deliberately no proficiency ratings. */
export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: [
      { name: "JavaScript", context: "My everyday language across the frontend and backend.", usedIn: [PAIMANA, SCHEME, MENTOR], core: true },
      { name: "TypeScript", context: "Typed code for larger applications, including Paimana, CoreLog and this portfolio.", usedIn: [PAIMANA, CORELOG, THIS_SITE], core: true },
      { name: "Java", context: "Part of my programming foundation, including academic coursework.", usedIn: [] },
      { name: "C", context: "Part of my programming foundation, including data structure programs.", usedIn: [] },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", context: "Internal dashboards at Helpee, plus the interfaces of my personal projects.", usedIn: [HELPEE, PAIMANA, SCHEME, CORELOG, MENTOR, THIS_SITE], core: true },
      { name: "HTML", context: "The base of every web interface I build; covered by my freeCodeCamp Responsive Web Design certificate.", usedIn: [THIS_SITE] },
      { name: "CSS", context: "Responsive layouts and theming, including this site's light and dark design tokens.", usedIn: [THIS_SITE] },
      { name: "Tailwind CSS", context: "Utility-first styling, used throughout this portfolio.", usedIn: [THIS_SITE] },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", context: "Dashboard services and cron-based daily reports at Helpee, and my project backends.", usedIn: [HELPEE, PAIMANA, SCHEME, CORELOG, MENTOR], core: true },
      { name: "Express", context: "Server framework for the Paimana and SchemeLens APIs, the CoreLog backend and the Virtual Mentor REST APIs.", usedIn: [PAIMANA, SCHEME, CORELOG, MENTOR], core: true },
      { name: "GraphQL", context: "Designing APIs and optimising resolvers for dashboard modules at Helpee.", usedIn: [HELPEE], core: true },
      { name: "REST APIs", context: "The stateless extract and analyze endpoints in Paimana, the validated question API in SchemeLens, and authentication, session tracking and data storage in Virtual Mentor.", usedIn: [PAIMANA, SCHEME, MENTOR] },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "MongoDB", context: "Query optimisation at Helpee, Atlas Vector Search for retrieval in SchemeLens, and multi-content-type schema design in CoreLog.", usedIn: [HELPEE, SCHEME, CORELOG, MENTOR], core: true },
      { name: "MySQL", context: "Relational database skills, supported by SQL Essential Training on LinkedIn Learning.", usedIn: [] },
    ],
  },
  {
    category: "Cloud",
    skills: [
      { name: "Vercel", context: "Hosts CoreLog and the Paimana frontend.", usedIn: [PAIMANA, CORELOG] },
      { name: "AWS", context: "In professional work at Helpee: AWS-hosted dashboard modules and AWS Rekognition for profile-photo verification.", usedIn: [HELPEE], core: true },
    ],
  },
  {
    category: "Developer tools",
    skills: [
      { name: "Git", context: "Version control across my professional and personal work.", usedIn: [] },
      { name: "GitHub", context: "Where my personal projects and their source code live.", usedIn: [CORELOG, MENTOR] },
      { name: "VS Code", context: "My primary code editor.", usedIn: [] },
      { name: "Postman", context: "Used for working with and testing APIs.", usedIn: [] },
      { name: "Markdown", context: "Used for technical notes and project documentation.", usedIn: [] },
    ],
  },
  {
    category: "AI tools",
    skills: [
      { name: "Claude", context: "AI-assisted development: Paimana and SchemeLens were built step by step with Claude Code under written rules, and I completed Anthropic's Claude Code in Action course.", usedIn: [PAIMANA, SCHEME] },
      { name: "Codex", context: "AI-assisted development.", usedIn: [] },
      { name: "Gemini", context: "The model that reads lab reports in Paimana and answers questions in SchemeLens, kept behind swappable interfaces; also used for AI-assisted development.", usedIn: [PAIMANA, SCHEME] },
    ],
  },
];

export const certifications = [
  "Claude Code in Action — Anthropic",
  "JavaScript Algorithms and Data Structures (Beta) — freeCodeCamp",
  "Responsive Web Design — freeCodeCamp",
  "Develop Your AI Prompt Engineering Skills — LinkedIn Learning",
  "SQL Essential Training — LinkedIn Learning",
  "Presented a doubly-linked-list seminar; won Techno Meet and joined the Aptitude Hackathon at CMRIT",
];
