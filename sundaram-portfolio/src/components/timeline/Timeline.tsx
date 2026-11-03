"use client";

import { GitCommitHorizontal, GitMerge, TrendingDown } from "lucide-react";
import { Fragment, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { roles, type Role } from "@/data/experience";

/** A stable, git-style short hash for each role, so it reads like a commit. */
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

function duration(role: Role, currentMonth: number | null) {
  const end = role.end ? monthIndex(role.end) : currentMonth;
  if (end === null) return "ongoing";
  const months = Math.max(1, end - monthIndex(role.start) + (role.end ? 0 : 1));
  const label = months >= 12 ? `${Math.floor(months / 12)} yr ${months % 12 ? `${months % 12} mo` : ""}`.trim() : `${months} mo`;
  return role.end ? label : `${label} · ongoing`;
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

export function Timeline() {
  const [activeId, setActiveId] = useState(roles[0].id);
  const [tool, setTool] = useState<string | null>(null);
  const currentMonth = useCurrentMonth();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const active = roles.find((role) => role.id === activeId) ?? roles[0];
  const activeIndex = roles.indexOf(active);

  function select(index: number) {
    setActiveId(roles[index].id);
    setTool(null);
  }

  // Arrow keys move between commits, like stepping through a log.
  function onKeyDown(event: KeyboardEvent<HTMLOListElement>) {
    const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = Math.min(roles.length - 1, Math.max(0, activeIndex + step));
    select(next);
    buttons.current[next]?.focus();
  }

  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="experience-heading" label="Experience" title="Where I've been building" />
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          My career as a git log. Pick a commit to read its release notes, then pick a tool to see where I used it.
        </p>

        <Reveal className="mt-10 grid items-start gap-6 lg:grid-cols-[24rem_minmax(0,1fr)] lg:gap-8">
          {/* The graph: the internship is a branch that merges into main with the promotion. */}
          <div>
            <p className="eyebrow">
              <span className="text-accent">$</span> git log --graph career
            </p>
            <ol className="mt-4" aria-label="Roles, most recent first" onKeyDown={onKeyDown}>
              {roles.map((role, index) => {
                const isActive = role.id === active.id;
                const onMain = index === 0 || role.type === "Full-time";
                const next = roles[index + 1];
                const promotedFrom = next && next.organisation === role.organisation && next.type === "Internship";
                return (
                  <Fragment key={role.id}>
                    <li className="relative">
                      {/* Lanes: main on the left, the branch to its right. */}
                      {onMain ? (
                        <span aria-hidden="true" className="absolute top-7 bottom-0 left-[11px] w-0.5 bg-accent/70" />
                      ) : (
                        <span aria-hidden="true" className="git-fade absolute top-0 bottom-0 left-[35px] w-0.5 bg-line" />
                      )}
                      <span
                        aria-hidden="true"
                        className={`absolute top-5 grid size-6 place-items-center rounded-full border-2 transition-colors ${
                          onMain ? "left-0" : "left-6"
                        } ${isActive ? "border-accent bg-accent" : "border-line bg-surface"} ${index === 0 ? "git-head" : ""}`}
                      >
                        <span className={`size-2 rounded-full ${isActive ? "bg-on-accent" : "bg-muted"}`} />
                      </span>

                      <button
                        ref={(element) => {
                          buttons.current[index] = element;
                        }}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => select(index)}
                        className={`git-commit card spotlight block p-4 text-left ${onMain ? "ml-10 w-[calc(100%-2.5rem)]" : "ml-14 w-[calc(100%-3.5rem)]"} ${
                          isActive ? "is-active" : ""
                        }`}
                      >
                        <span className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="text-(--warning)">{shortHash(role.id)}</span>
                          {index === 0 && (
                            <span className="rounded border border-accent/50 px-1.5 text-accent">HEAD → main</span>
                          )}
                          {role.type === "Internship" && <span className="rounded border border-line px-1.5 text-muted">intern</span>}
                        </span>
                        <span className="mt-2 block leading-snug font-semibold">{role.title}</span>
                        <span className="mt-1 block text-sm text-muted">{role.organisation}</span>
                        <span className="mt-2 flex flex-wrap gap-x-3 font-mono text-xs text-muted">
                          <span>{role.period}</span>
                          <span className={role.end ? "" : "text-success"}>{duration(role, currentMonth)}</span>
                        </span>
                      </button>
                    </li>

                    {promotedFrom && (
                      <li aria-hidden="true" className="relative h-14">
                        <span className="absolute top-0 left-[11px] h-2 w-0.5 bg-accent/70" />
                        <svg className="absolute bottom-0 left-[11px] h-full w-7 overflow-visible" viewBox="0 0 28 56" preserveAspectRatio="none" fill="none">
                          <path d="M25 56 C25 30, 1 30, 1 8" stroke="var(--muted)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        </svg>
                        <span className="absolute top-1/2 left-14 flex -translate-y-1/2 items-center gap-2 font-mono text-xs text-muted">
                          <GitMerge className="size-3.5 text-accent" />
                          merge: promoted to full-time
                        </span>
                      </li>
                    )}
                  </Fragment>
                );
              })}
            </ol>
          </div>

          {/* Release notes for the selected commit. */}
          <article key={active.id} aria-live="polite" className="card term-entry overflow-hidden lg:sticky lg:top-24">
            <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line bg-elevated px-5 py-3 font-mono text-xs text-muted md:px-6">
              <GitCommitHorizontal className="size-4 text-accent" aria-hidden="true" />
              <span>
                commit <span className="text-(--warning)">{shortHash(active.id)}</span>
              </span>
              <span className="ml-auto">{active.location}</span>
            </header>

            <div className="p-5 md:p-7">
              <p className="eyebrow uppercase">{active.type}</p>
              <h3 className="font-display mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{active.title}</h3>
              <p className="mt-1 text-muted">
                {active.organisation} · {active.period}
              </p>

              {active.highlight && (
                <div className="mt-5 flex gap-3 rounded-lg bg-accent-soft p-4">
                  <TrendingDown className="mt-0.5 size-5 flex-none text-accent" aria-hidden="true" />
                  <p>
                    <span className="eyebrow block uppercase">{active.highlight.label}</span>
                    <span className="font-display mt-1 block text-lg leading-snug font-medium">{active.highlight.text}</span>
                  </p>
                </div>
              )}

              <p className="eyebrow mt-6 uppercase">Release notes</p>
              <ul className="mt-3 space-y-3 leading-relaxed">
                {active.details.map((detail) => {
                  const dimmed = tool !== null && !mentions(detail, tool);
                  return (
                    <li key={detail} className={`flex gap-3 transition-opacity duration-300 ${dimmed ? "opacity-35" : ""}`}>
                      <span aria-hidden="true" className="flex-none font-mono font-semibold text-success">
                        +
                      </span>
                      <span className="text-muted">{highlight(detail, tool)}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 border-t border-dashed border-line pt-5">
                <p className="eyebrow">Built with · pick one to trace it</p>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {active.stack.map((item) => {
                    const used = active.details.some((detail) => mentions(detail, item));
                    const isOn = tool === item;
                    return (
                      <li key={item}>
                        {used ? (
                          <button
                            type="button"
                            aria-pressed={isOn}
                            onClick={() => setTool(isOn ? null : item)}
                            className={`tag cursor-pointer items-center gap-1.5 transition-colors ${isOn ? "border-accent bg-accent text-on-accent" : "border-accent/40 text-ink hover:border-accent"}`}
                          >
                            <span aria-hidden="true" className={`size-1.5 rounded-full ${isOn ? "bg-on-accent" : "bg-accent"}`} />
                            {item}
                          </button>
                        ) : (
                          <span className="tag">{item}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
