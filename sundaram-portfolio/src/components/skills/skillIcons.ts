import { Bot, Waypoints } from "lucide-react";
import type { ComponentType } from "react";
import { FaAws, FaJava } from "react-icons/fa";
import {
  SiC,
  SiClaude,
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiMarkdown,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPostman,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

type SkillIcon = { Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>; color?: string };

/** `color` is the tool's brand colour. Monochrome marks omit it and follow the theme's text colour. */
export const skillIcons: Record<string, SkillIcon> = {
  JavaScript: { Icon: SiJavascript, color: "#E5C300" },
  TypeScript: { Icon: SiTypescript, color: "#3178C6" },
  Java: { Icon: FaJava, color: "#E76F00" },
  C: { Icon: SiC, color: "#5C8DBC" },
  React: { Icon: SiReact, color: "#35BFE0" },
  HTML: { Icon: SiHtml5, color: "#E34F26" },
  CSS: { Icon: SiCss, color: "#663399" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#06B6D4" },
  "Node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
  Express: { Icon: SiExpress },
  GraphQL: { Icon: SiGraphql, color: "#E10098" },
  "REST APIs": { Icon: Waypoints },
  MongoDB: { Icon: SiMongodb, color: "#47A248" },
  MySQL: { Icon: SiMysql, color: "#4479A1" },
  Vercel: { Icon: SiVercel },
  AWS: { Icon: FaAws, color: "#FF9900" },
  Git: { Icon: SiGit, color: "#F05032" },
  GitHub: { Icon: SiGithub },
  "VS Code": { Icon: VscVscode, color: "#2F9FE8" },
  Postman: { Icon: SiPostman, color: "#FF6C37" },
  Markdown: { Icon: SiMarkdown },
  Claude: { Icon: SiClaude, color: "#D97757" },
  Codex: { Icon: Bot },
  Gemini: { Icon: SiGooglegemini, color: "#8E75B2" },
};
