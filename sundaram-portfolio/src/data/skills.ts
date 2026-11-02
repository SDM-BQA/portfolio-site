export type Skill = { name: string; context: string; usedIn: string[] };
export type SkillGroup = { category: string; skills: Skill[] };

const HELPEE = "Helpee";
const CORELOG = "CoreLog";
const MENTOR = "Virtual Mentor";
const THIS_SITE = "This site";

/** Context describes where a skill was used; there are deliberately no proficiency ratings. */
export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: [
      { name: "JavaScript", context: "My everyday language across the frontend and backend.", usedIn: [MENTOR] },
      { name: "TypeScript", context: "Typed code for larger applications, including CoreLog and this portfolio.", usedIn: [CORELOG, THIS_SITE] },
      { name: "Java", context: "Part of my programming foundation, including academic coursework.", usedIn: [] },
      { name: "C", context: "Part of my programming foundation, including data structure programs.", usedIn: [] },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", context: "Internal dashboards at Helpee, plus the interfaces of my personal projects.", usedIn: [HELPEE, CORELOG, MENTOR, THIS_SITE] },
      { name: "HTML", context: "The base of every web interface I build; covered by my freeCodeCamp Responsive Web Design certificate.", usedIn: [THIS_SITE] },
      { name: "CSS", context: "Responsive layouts and theming, including this site's light and dark design tokens.", usedIn: [THIS_SITE] },
      { name: "Tailwind CSS", context: "Utility-first styling, used throughout this portfolio.", usedIn: [THIS_SITE] },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", context: "Dashboard services and cron-based daily reports at Helpee, and my project backends.", usedIn: [HELPEE, CORELOG, MENTOR] },
      { name: "Express", context: "Server framework for the CoreLog backend and the Virtual Mentor REST APIs.", usedIn: [CORELOG, MENTOR] },
      { name: "GraphQL", context: "Designing APIs and optimising resolvers for dashboard modules at Helpee.", usedIn: [HELPEE] },
      { name: "REST APIs", context: "Built for authentication, session tracking and data storage in Virtual Mentor.", usedIn: [MENTOR] },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "MongoDB", context: "Query optimisation at Helpee and multi-content-type schema design in CoreLog.", usedIn: [HELPEE, CORELOG, MENTOR] },
      { name: "MySQL", context: "Relational database skills, supported by SQL Essential Training on LinkedIn Learning.", usedIn: [] },
    ],
  },
  {
    category: "Cloud",
    skills: [
      { name: "Vercel", context: "Hosts CoreLog.", usedIn: [CORELOG] },
      { name: "AWS", context: "In professional work at Helpee: AWS-hosted dashboard modules and AWS Rekognition for profile-photo verification.", usedIn: [HELPEE] },
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
      { name: "Claude", context: "AI-assisted development; I completed Anthropic's Claude Code in Action course.", usedIn: [] },
      { name: "Codex", context: "AI-assisted development.", usedIn: [] },
      { name: "Gemini", context: "AI-assisted development.", usedIn: [] },
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
