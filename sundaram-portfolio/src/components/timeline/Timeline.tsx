"use client";

import { ArrowRight, GitBranch, GitMerge, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { degrees, roles, type Degree, type Role } from "@/data/experience";
import { CareerAvatar, AVATAR_SIZE, type Stage } from "./CareerAvatar";

/** A stable, git-style short hash for each entry, so it reads like a commit. */
function shortHash(id: string) {
  let hash = 2166136261;
  for (const char of id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

const monthIndex = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + month - 1;
};

const noop = () => () => {};
/** The current month, read only on the client so server and client markup agree. */
function useCurrentMonth() {
  return useSyncExternalStore(
    noop,
    () => {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    },
    () => null,
  );
}

function formatMonths(months: number) {
  if (months < 12) return `${months} mo`;
  const rest = months % 12;
  return `${Math.floor(months / 12)} yr${rest ? ` ${rest} mo` : ""}`;
}

/** Months in a role; the current one counts the month in progress. */
function monthsIn(role: Role, currentMonth: number | null) {
  const end = role.end ? monthIndex(role.end) : currentMonth;
  if (end === null) return null;
  return Math.max(1, end - monthIndex(role.start) + (role.end ? 0 : 1));
}

/** Does this line of work mention the tool? */
const mentions = (text: string, tool: string) => text.toLowerCase().includes(tool.toLowerCase());

/** Wraps each mention of the active tool in a highlight. */
function highlight(text: string, tool: string | null): ReactNode {
  if (!tool) return text;
  const pattern = new RegExp(`(${tool.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.split(pattern).map((part, index) =>
    index % 2 ? (
      <mark key={index} className="rounded bg-accent-soft px-0.5 text-ink">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// Most recent first, like `git log`: where I work now leads, and college is the root commit.
type Entry = { kind: "degree"; degree: Degree } | { kind: "role"; role: Role };
const entries: Entry[] = [
  ...roles.map((role) => ({ kind: "role" as const, role })),
  ...degrees.map((degree) => ({ kind: "degree" as const, degree })),
];
const stageOf = (entry: Entry): Stage =>
  entry.kind === "degree" ? "college" : entry.role.type === "Internship" ? "intern" : "professional";

// Every tool across the career, with how many lines of work mention it. Tools never
// mentioned in a line can't be traced, so they aren't offered as filters.
const allLines = [...roles.flatMap((role) => role.details), ...degrees.flatMap((degree) => degree.details ?? [])];
const tools = [...new Set([...roles.flatMap((role) => role.stack), ...degrees.flatMap((degree) => degree.stack ?? [])])]
  .map((name) => ({ name, count: allLines.filter((line) => mentions(line, name)).length }))
  .filter((tool) => tool.count > 0)
  .sort((a, b) => b.count - a.count);

const firstRole = roles[roles.length - 1];
const internship = roles.find((role) => role.type === "Internship");
const promotedAfter = internship?.end ? monthIndex(internship.end) - monthIndex(internship.start) : null;

/** Main runs down the left lane the whole way, from HEAD to the root commit; the internship is a branch beside it. */
function MainLane({ head = false, root = false }: { head?: boolean; root?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-[11px] w-0.5 bg-accent/60 ${head ? "top-4" : "top-0"} ${root ? "h-4" : "bottom-0"}`}
    />
  );
}

function Dot({ branch = false, head = false }: { branch?: boolean; head?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-1 grid size-6 place-items-center rounded-full border-2 ${
        branch ? "left-6 border-muted bg-surface" : "left-0 border-accent bg-surface"
      } ${head ? "git-head" : ""}`}
    >
      <span className={`size-2 rounded-full ${branch ? "bg-muted" : "bg-accent"}`} />
    </span>
  );
}

function Hash({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <p className="flex flex-wrap items-center gap-2 font-mono text-xs">
      <span className="text-(--warning)">{shortHash(id)}</span>
      {children}
    </p>
  );
}

/** Release notes: one "+" line per piece of work, dimmed unless it mentions the traced tool. */
function Notes({ lines, tool }: { lines: string[]; tool: string | null }) {
  return (
    <ul className="space-y-3 leading-relaxed">
      {lines.map((line) => {
        const dimmed = tool !== null && !mentions(line, tool);
        return (
          <li key={line} className={`flex gap-3 transition-opacity duration-300 ${dimmed ? "opacity-30" : ""}`}>
            <span aria-hidden="true" className="flex-none font-mono font-semibold text-success">
              +
            </span>
            <span className="text-muted">{highlight(line, tool)}</span>
          </li>
        );
      })}
    </ul>
  );
}

function DegreeCommit({ degree, root, tool }: { degree: Degree; root: boolean; tool: string | null }) {
  const tag = (
    <Hash id={degree.id}>
      <span className="rounded border border-line px-1.5 text-muted">college</span>
    </Hash>
  );

  // A degree with work to show reads like a role; one without stays a short commit.
  if (degree.details) {
    return (
      <li data-stage="college" className={`relative pl-16 md:pl-20 ${root ? "pb-4" : "pb-10"}`}>
        <MainLane root={root} />
        <Dot />
        <article className="grid gap-x-10 gap-y-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <header>
            {tag}
            <h3 className="font-display mt-2 text-2xl leading-tight font-semibold tracking-tight md:text-[1.75rem]">{degree.degree}</h3>
            <p className="mt-1.5 text-muted">
              {degree.institution} · {degree.location.split(",")[0]}
            </p>
            <p className="mt-3 font-mono text-xs text-muted">{degree.period}</p>
            {degree.projects?.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group mt-4 inline-flex min-h-6 items-center gap-1.5 text-sm font-medium hover:text-accent"
              >
                {project.name} case study
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </header>
          <div className="min-w-0">
            <Notes lines={degree.details} tool={tool} />
          </div>
        </article>
      </li>
    );
  }

  return (
    <li data-stage="college" className={`relative pl-16 md:pl-20 ${root ? "pb-4" : "pb-10"}`}>
      <MainLane root={root} />
      <Dot />
      {tag}
      <h3 className="mt-2 text-lg leading-snug font-semibold">{degree.degree}</h3>
      <p className="mt-1 text-sm text-muted">
        {degree.institution} · <span className="font-mono text-xs">{degree.period}</span>
      </p>
    </li>
  );
}

function RoleCommit({ role, isHead, tool, currentMonth }: { role: Role; isHead: boolean; tool: string | null; currentMonth: number | null }) {
  const onBranch = role.type === "Internship";
  const months = monthsIn(role, currentMonth);

  return (
    <li data-stage={onBranch ? "intern" : "professional"} className="relative pb-10 pl-16 md:pl-20">
      <MainLane head={isHead} />
      {onBranch && <span aria-hidden="true" className="absolute top-0 bottom-0 left-[35px] w-0.5 bg-muted/60" />}
      <Dot branch={onBranch} head={isHead} />

      <article className="grid gap-x-10 gap-y-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <header>
          <Hash id={role.id}>
            {isHead && <span className="rounded border border-accent/50 px-1.5 text-accent">HEAD → main</span>}
            {onBranch && <span className="rounded border border-line px-1.5 text-muted">branch: intern</span>}
          </Hash>
          <h3 className="font-display mt-2 text-2xl leading-tight font-semibold tracking-tight md:text-[1.75rem]">{role.title}</h3>
          <p className="mt-1.5 text-muted">
            {role.organisation} · {role.location}
          </p>
          <p className="mt-3 flex flex-wrap gap-x-3 font-mono text-xs text-muted">
            <span>{role.period}</span>
            {months !== null && (
              <span className={role.end ? "" : "text-success"}>
                {formatMonths(months)}
                {role.end ? "" : " · ongoing"}
              </span>
            )}
          </p>
        </header>

        <div className="min-w-0">
          {role.highlight && (
            <div className="mb-6 flex gap-3 rounded-lg bg-highlight-soft p-4">
              <TrendingDown className="mt-0.5 size-5 flex-none text-highlight" aria-hidden="true" />
              <p>
                <span className="eyebrow block text-highlight uppercase">{role.highlight.label}</span>
                <span className="font-display mt-1 block text-lg leading-snug font-medium">{role.highlight.text}</span>
              </p>
            </div>
          )}
          <Notes lines={role.details} tool={tool} />
        </div>
      </article>
    </li>
  );
}

/**
 * A curve between the lanes, read top to bottom (newest to oldest): from main across to the
 * internship branch where the promotion merged it, and back to main where the branch began.
 */
function Connector({ merge, children }: { merge: boolean; children: ReactNode }) {
  const Icon = merge ? GitMerge : GitBranch;
  return (
    <li aria-hidden="true" className="relative -mt-6 h-16 pl-16 md:pl-20">
      <MainLane />
      <svg className="absolute top-0 left-[11px] h-full w-7 overflow-visible" viewBox="0 0 28 64" preserveAspectRatio="none" fill="none">
        <path
          d={merge ? "M1 0 C1 34, 25 30, 25 64" : "M25 0 C25 34, 1 30, 1 64"}
          stroke="var(--muted)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="absolute top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[0.6875rem] whitespace-nowrap md:px-3 md:text-xs">
        <Icon className="size-3.5 text-accent" />
        {children}
      </span>
    </li>
  );
}

/** Moves the avatar down the graph with the scroll, and reports which commit it is on. */
function useAvatarTrack() {
  const listRef = useRef<HTMLOListElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>(stageOf(entries[0]));

  useEffect(() => {
    const list = listRef.current;
    const avatar = avatarRef.current;
    if (!list || !avatar) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      // The avatar sits where the middle of the screen crosses the graph, kept inside it.
      const y = Math.min(rect.height - AVATAR_SIZE, Math.max(0, window.innerHeight * 0.5 - rect.top - AVATAR_SIZE / 2));
      avatar.style.setProperty("--y", `${y}px`);
      let next: Stage = stageOf(entries[0]);
      for (const item of list.querySelectorAll<HTMLElement>("[data-stage]")) {
        if (item.offsetTop <= y + AVATAR_SIZE / 2) next = item.dataset.stage as Stage;
      }
      setStage(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return { listRef, avatarRef, stage };
}

export function Timeline() {
  const [tool, setTool] = useState<string | null>(null);
  const currentMonth = useCurrentMonth();
  const { listRef, avatarRef, stage } = useAvatarTrack();
  const tenure = currentMonth === null ? null : currentMonth - monthIndex(firstRole.start) + 1;
  const matches = tool ? allLines.filter((line) => mentions(line, tool)).length : 0;

  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-16 md:py-24">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <SectionHeading id="experience-heading" label="Experience" title="Where I've been building" />
          {/* The career at a glance: one company, one promotion. */}
          <Reveal>
            <dl className="flex gap-8 pb-1">
              <div>
                <dt className="eyebrow">At {firstRole.organisation.split(" ")[0]}</dt>
                <dd className="font-display mt-1 min-h-8 text-2xl font-semibold tracking-tight text-highlight">
                  {tenure === null ? " " : formatMonths(tenure)}
                </dd>
              </div>
              {promotedAfter !== null && (
                <div>
                  <dt className="eyebrow">Intern → full-time</dt>
                  <dd className="font-display mt-1 text-2xl font-semibold tracking-tight text-highlight">{formatMonths(promotedAfter)}</dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <div className="card overflow-hidden">
            {/* git log --grep: pick a tool to see every line of work that mentions it. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line bg-elevated px-5 py-3 md:px-6">
              <p className="font-mono text-xs text-muted">
                <span className="text-accent">$</span> git log --graph{tool ? ` --grep="${tool}"` : ""}
              </p>
              <div role="group" aria-label="Trace a tool through my work" className="flex flex-wrap gap-1.5 md:ml-auto">
                {tools.map(({ name, count }) => {
                  const isOn = tool === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={isOn}
                      onClick={() => setTool(isOn ? null : name)}
                      className={`tag min-h-8 cursor-pointer items-center gap-1.5 transition-colors ${
                        isOn ? "border-accent bg-accent text-on-accent" : "text-ink hover:border-accent"
                      }`}
                    >
                      {name}
                      <span className={isOn ? "opacity-75" : "text-muted"}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <p aria-live="polite" className="sr-only">
              {tool ? `${matches} lines of work mention ${tool}.` : ""}
            </p>

            <div className="px-5 pt-8 pb-2 md:px-8 md:pt-10">
              <ol ref={listRef} className="relative" aria-label="From now back to college, most recent first">
                <CareerAvatar ref={avatarRef} stage={stage} />
                {entries.map((entry, index) => {
                  const previous = entries[index - 1];
                  // A lane change sits between two commits: the promotion merge, then the branch's start.
                  const connector =
                    previous && stageOf(previous) !== stageOf(entry)
                      ? stageOf(entry) === "intern"
                        ? { merge: true, label: "merge: promoted to full-time" }
                        : stageOf(previous) === "intern"
                          ? { merge: false, label: "branch: internship" }
                          : null
                      : null;
                  return (
                    <Fragment key={entry.kind === "degree" ? entry.degree.id : entry.role.id}>
                      {connector && <Connector merge={connector.merge}>{connector.label}</Connector>}
                      {entry.kind === "degree" ? (
                        <DegreeCommit degree={entry.degree} root={index === entries.length - 1} tool={tool} />
                      ) : (
                        <RoleCommit role={entry.role} isHead={index === 0} tool={tool} currentMonth={currentMonth} />
                      )}
                    </Fragment>
                  );
                })}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
