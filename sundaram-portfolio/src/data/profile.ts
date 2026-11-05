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
  tagline: "Building products. Solving real problems.",
  description:
    "Full Stack Developer building practical web products with React, Node.js, GraphQL and MongoDB.",
  intro:
    "Full Stack Developer crafting web applications with React, Node.js, GraphQL and MongoDB.",
  coreStack: ["React", "Node.js", "GraphQL", "MongoDB", "JavaScript", "TypeScript"],
  bio: [
    "I'm Sundaram, a Full Stack Developer passionate about building practical digital products and solving real-world problems through technology.",
    "I enjoy working across the frontend and backend, understanding how systems connect, and turning ideas into applications that people can actually use.",
    "Beyond coding, I'm constantly exploring new technologies, improving my engineering skills and building things of my own.",
  ],
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
