import { degrees, roles } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

export type OutputLine =
  | { kind: "text" | "heading" | "muted" | "error"; text: string }
  | { kind: "link"; label: string; href: string; external?: boolean };

export type CommandResult =
  | { type: "clear" }
  | { type: "output"; lines: OutputLine[]; open?: string };

type Command = { description: string; run: () => CommandResult };

const output = (lines: OutputLine[], open?: string): CommandResult => ({ type: "output", lines, open });
const text = (value: string): OutputLine => ({ kind: "text", text: value });
const heading = (value: string): OutputLine => ({ kind: "heading", text: value });
const muted = (value: string): OutputLine => ({ kind: "muted", text: value });

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
  const command = commands.get(raw.trim().toLowerCase());
  if (command) return command.run();
  return output([
    { kind: "error", text: `Command not found: ${raw.trim()}` },
    muted("Type help to see the available commands."),
  ]);
}

/** Commands that start with the typed text, for Tab completion. */
export function completeCommand(raw: string) {
  const prefix = raw.trim().toLowerCase();
  return prefix ? commandNames.filter((name) => name.startsWith(prefix)) : [];
}
