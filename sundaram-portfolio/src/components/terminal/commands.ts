import { degrees, roles } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

export type OutputLine =
  | { kind: "text" | "heading" | "muted" | "error"; text: string }
  | { kind: "link"; label: string; href: string; external?: boolean };

export type CommandResult =
  | { type: "clear" }
  /** `open` opens a URL in a new tab; `showSkill` scrolls to the Skills section and selects that tool. */
  | { type: "output"; lines: OutputLine[]; open?: string; showSkill?: string };

/** `takesArgs` commands receive the words after the name; the rest reject arguments. */
type Command = { description: string; takesArgs?: boolean; run: (args: string[]) => CommandResult };

const output = (lines: OutputLine[], open?: string): CommandResult => ({ type: "output", lines, open });
const text = (value: string): OutputLine => ({ kind: "text", text: value });
const heading = (value: string): OutputLine => ({ kind: "heading", text: value });
const muted = (value: string): OutputLine => ({ kind: "muted", text: value });
const error = (value: string): OutputLine => ({ kind: "error", text: value });

const allSkills = skillGroups.flatMap((group) => group.skills.map((skill) => ({ ...skill, category: group.category })));
const DETAILS_FLAGS = ["--details", "-d"];

/** Tool names are matched without case, spaces or punctuation, so "node.js", "nodejs" and "Node JS" all work. */
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  node: "nodejs",
  tailwind: "tailwindcss",
  mongo: "mongodb",
  gql: "graphql",
  rest: "restapis",
  vsc: "vscode",
};

function findSkill(query: string) {
  const key = ALIASES[slug(query)] ?? slug(query);
  if (!key) return undefined;
  const exact = allSkills.find((skill) => slug(skill.name) === key);
  if (exact) return exact;
  const partial = allSkills.filter((skill) => slug(skill.name).startsWith(key));
  return partial.length === 1 ? partial[0] : undefined;
}

const STACK_USAGE = "Usage: stack --details <tool>   e.g. stack --details react";

function stack(args: string[]): CommandResult {
  if (args.length === 0) {
    return output([
      heading("Core stack"),
      text(allSkills.filter((skill) => skill.core).map((skill) => skill.name).join(", ")),
      muted(STACK_USAGE),
    ]);
  }
  if (!DETAILS_FLAGS.includes(args[0].toLowerCase())) {
    return output([error(`Unknown option: ${args[0]}`), muted(STACK_USAGE)]);
  }
  const query = args.slice(1).join(" ");
  if (!query) return output([error("Which tool? Add a name after --details."), muted(STACK_USAGE)]);

  const skill = findSkill(query);
  if (!skill) {
    return output([
      error(`No tool called "${query}" in my stack.`),
      muted(`Try one of: ${allSkills.map((item) => slug(item.name)).join(", ")}`),
    ]);
  }
  return {
    type: "output",
    showSkill: skill.name,
    lines: [
      heading(`${skill.name} · ${skill.category}`),
      text(skill.context),
      ...(skill.usedIn.length ? [muted(`Used in: ${skill.usedIn.join(", ")}`)] : []),
      muted(`→ Showing ${skill.name} in the Skills section.`),
    ],
  };
}

/**
 * The complete allowlist. Input only ever selects one of these entries; nothing
 * is evaluated, sent to a server or passed to a shell (FR-007, FR-010).
 */
const commands: Map<string, Command> = new Map<string, Command>([
  [
    "help",
    {
      description: "List available commands",
      run: () =>
        output([
          heading("Available commands"),
          ...[...commands.entries()].map(([name, command]) => text(`${name.padEnd(12)}${command.description}`)),
          muted("Tab completes commands and tool names."),
        ]),
    },
  ],
  [
    "whoami",
    {
      description: "Name, role and short introduction",
      run: () => output([heading(profile.name), text(`${profile.role} · ${profile.locationShort}`), muted(profile.intro)]),
    },
  ],
  [
    "about",
    {
      description: "About me",
      run: () =>
        output([...profile.bio.map(text), { kind: "link", label: "Go to the About section", href: "/#about" }]),
    },
  ],
  [
    "experience",
    {
      description: "Career history",
      run: () =>
        output([
          ...roles.flatMap((item) => [heading(`${item.title} — ${item.organisation}`), muted(item.period)]),
          { kind: "link", label: "Go to the Experience section", href: "/#experience" },
        ]),
    },
  ],
  [
    "projects",
    {
      description: "Featured projects",
      run: () =>
        output(
          projects.flatMap((project): OutputLine[] => [
            heading(`${project.name} (${project.category})`),
            muted(project.summary),
            { kind: "link", label: `Read the ${project.name} case study`, href: `/projects/${project.slug}` },
          ]),
        ),
    },
  ],
  [
    "education",
    {
      description: "Degrees and CGPA",
      run: () =>
        output([
          ...degrees.flatMap((item) => [
            heading(`${item.degree} — ${item.institution}`),
            muted(`${item.period} · CGPA ${item.cgpa.toFixed(2)}`),
          ]),
          { kind: "link", label: "Go to the Education section", href: "/#education" },
        ]),
    },
  ],
  [
    "skills",
    {
      description: "Skills grouped by category",
      run: () =>
        output(
          skillGroups.flatMap((group) => [
            heading(group.category),
            text(group.skills.map((skill) => skill.name).join(", ")),
          ]),
        ),
    },
  ],
  [
    "stack",
    {
      description: "Details on one tool: stack --details react",
      takesArgs: true,
      run: stack,
    },
  ],
  [
    "github",
    {
      description: "Open my GitHub profile",
      run: () =>
        output(
          [text("Opening GitHub in a new tab."), { kind: "link", label: profile.github, href: profile.github, external: true }],
          profile.github,
        ),
    },
  ],
  [
    "linkedin",
    {
      description: "Open my LinkedIn profile",
      run: () =>
        output(
          [text("Opening LinkedIn in a new tab."), { kind: "link", label: profile.linkedin, href: profile.linkedin, external: true }],
          profile.linkedin,
        ),
    },
  ],
  [
    "resume",
    {
      description: "Open my resume (PDF)",
      run: () =>
        output(
          [text("Opening the resume PDF in a new tab."), { kind: "link", label: "Open resume", href: profile.resume, external: true }],
          profile.resume,
        ),
    },
  ],
  [
    "contact",
    {
      description: "Email and contact links",
      run: () =>
        output([
          { kind: "link", label: profile.email, href: `mailto:${profile.email}` },
          { kind: "link", label: "LinkedIn", href: profile.linkedin, external: true },
          { kind: "link", label: "GitHub", href: profile.github, external: true },
          { kind: "link", label: "Go to the Contact section", href: "/#contact" },
        ]),
    },
  ],
  ["clear", { description: "Clear terminal output", run: () => ({ type: "clear" }) }],
]);

export const commandNames = [...commands.keys()];

export function runCommand(raw: string): CommandResult {
  const [name = "", ...args] = raw.trim().split(/\s+/);
  const command = commands.get(name.toLowerCase());
  if (!command) {
    return output([error(`Command not found: ${raw.trim()}`), muted("Type help to see the available commands.")]);
  }
  if (args.length && !command.takesArgs) {
    return output([error(`${name} doesn't take any options.`), muted("Type help to see the available commands.")]);
  }
  return command.run(args);
}

/**
 * Full-line completions for Tab: command names first, then for "stack" the
 * --details flag and tool names.
 */
export function completeCommand(raw: string) {
  const typed = raw.trimStart().toLowerCase();
  if (!typed) return [];
  const words = typed.split(/\s+/);
  if (words.length === 1) return commandNames.filter((name) => name.startsWith(words[0]));
  if (words[0] !== "stack") return [];
  if (words.length === 2) return words[1] ? DETAILS_FLAGS.slice(0, 1).filter((flag) => flag.startsWith(words[1])).map((flag) => `stack ${flag} `) : ["stack --details "];
  if (words.length === 3 && DETAILS_FLAGS.includes(words[1])) {
    return allSkills
      .map((skill) => slug(skill.name))
      .filter((name) => name.startsWith(slug(words[2])))
      .map((name) => `stack ${words[1]} ${name}`);
  }
  return [];
}
