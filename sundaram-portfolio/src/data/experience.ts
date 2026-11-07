export type Role = {
  id: string;
  type: "Full-time" | "Internship";
  title: string;
  organisation: string;
  location: string;
  period: string;
  /** "YYYY-MM"; `end` is omitted for the current role. Used for the live duration. */
  start: string;
  end?: string;
  highlight?: { label: string; text: string };
  details: string[];
  stack: string[];
};

export type Degree = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  cgpa: number;
  /** Projects built during the degree; each slug has a case study under /projects. */
  projects?: { slug: string; name: string }[];
  /** What was built, shown like a role's release notes in the Experience graph. */
  details?: string[];
  stack?: string[];
};

/** Most recent first. */
export const roles: Role[] = [
  {
    id: "helpee-fulltime",
    type: "Full-time",
    title: "Full Stack Developer",
    organisation: "Helpee Elder Care",
    location: "Bengaluru",
    period: "December 2025 – Present",
    start: "2025-12",
    highlight: {
      label: "Estimated result",
      text: "70–80% reduction in the backlog of unpaid invoices on closed cases",
    },
    details: [
      "Designed and built a case-closure verification workflow that surfaces pending invoices, unraised charges and needed revisions before a case can be closed.",
      "Own the caregiver-facing PWA; built and shipped Phase 1 onboarding with AuthBridge and AWS Rekognition verification. Later phases are in progress.",
      "Build and maintain AWS-hosted internal dashboard modules for case management, invoicing and caregiver operations.",
      "Automated daily summary emails and analytics reports with Node.js cron jobs, and optimised MongoDB queries and GraphQL resolvers.",
    ],
    stack: ["React", "Node.js", "GraphQL", "MongoDB", "AWS", "PWA"],
  },
  {
    id: "helpee-intern",
    type: "Internship",
    title: "Full Stack Development Intern",
    organisation: "Helpee Elder Care",
    location: "Bengaluru",
    period: "June 2025 – December 2025",
    start: "2025-06",
    end: "2025-12",
    details: [
      "Developed and optimised GraphQL APIs and backend models for dashboard modules, including admin features for marketing analytics, error logging and elder-care data management.",
      "Worked with backend, frontend and product engineers in an Agile team, improving API response times and MongoDB query performance.",
    ],
    stack: ["GraphQL", "MongoDB", "Node.js", "Agile"],
  },
];

/** Most recent first. */
export const degrees: Degree[] = [
  {
    id: "mca",
    degree: "Master of Computer Applications",
    institution: "CMR Institute of Technology",
    location: "Bengaluru, Karnataka",
    period: "Completed November 2025",
    cgpa: 8.93,
    projects: [{ slug: "virtual-mentor", name: "Virtual Mentor" }],
    details: [
      "Built Virtual Mentor, a web app that connects mentors with mentees for online mentoring sessions.",
      "Mentors list their expertise and available time slots; mentees browse mentors and book sessions, with role-based access for each account type.",
      "Built REST APIs with Express.js for authentication, session tracking and secure data storage.",
      "Built a responsive React UI with reusable components, dynamic routing and dashboards for mentors and mentees.",
    ],
    stack: ["React", "JavaScript", "Node.js", "Express", "MongoDB"],
  },
  {
    id: "bsc",
    degree: "BSc Computer Science (Honours)",
    institution: "Bankura Sammilani College",
    location: "Bankura, West Bengal",
    period: "2020 – 2023",
    cgpa: 9.29,
  },
];
