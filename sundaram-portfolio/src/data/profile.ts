/** The site's brand and production domain. */
export const site = {
  name: "SundaramTech",
  domain: "sundaramtech.dev",
  url: "https://sundaramtech.dev",
} as const;

export const profile = {
  name: "Sundaram Dutta Modak",
  firstName: "Sundaram",
  role: "Full Stack Developer",
  location: "Bengaluru, Karnataka, India",
  locationShort: "Bengaluru, India",
  email: "hello@sundaramtech.dev",
  linkedin: "https://www.linkedin.com/in/sundaram-dutta-modak",
  github: "https://github.com/sdm-bqa",
  resume: "/resume.pdf",
  /** Set to an image path (e.g. "/sundaram.jpg" in public/) to show a portrait in About. */
  photo: undefined as string | undefined,
  tagline: "Software that makes complicated things plain.",
  description:
    "Full Stack Developer in Bengaluru building software that makes complicated things plain, with React, Node.js, GraphQL and MongoDB.",
  intro:
    "Full stack developer at Helpee Elder Care. I build software that makes complicated things plain for care teams, patients and citizens, with React, Node.js, GraphQL and MongoDB.",
  coreStack: ["React", "Node.js", "GraphQL", "MongoDB", "JavaScript", "TypeScript"],
  bio: [
    "I build software that makes complicated things plain: an unpaid invoice hidden in a closed case, a lab value outside its range, an eligibility rule buried in a government PDF.",
    "At Helpee I work across the whole stack: React interfaces for care managers and caregivers, the Node.js and GraphQL services behind them, and MongoDB queries tuned so dashboards load quickly.",
    "Outside work I build tools for everyday problems, like reading a lab report or checking whether a scheme applies to you, and I measure whether they actually work before I call them done.",
  ],
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "github", label: "GitHub" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
