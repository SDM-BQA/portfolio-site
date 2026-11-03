"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups, skillProjects } from "@/data/skills";
import { SELECT_SKILL_EVENT, type SelectSkillDetail } from "./selectSkill";
import { skillIcons } from "./skillIcons";

const ALL = "All";
const filters = [ALL, ...skillProjects.map((project) => project.name)];
const allSkills = skillGroups.flatMap((group) => group.skills.map((skill) => ({ ...skill, category: group.category })));
const coreSkills = allSkills.filter((skill) => skill.core);
const otherSkills = allSkills.filter((skill) => !skill.core);
const projectHref = Object.fromEntries(skillProjects.map((project) => [project.name, project.href]));

const brandStyle = (name: string) => {
  const color = skillIcons[name].color;
  return color ? ({ "--brand": color } as CSSProperties) : undefined;
};

export function Skills() {
  const [filter, setFilter] = useState(ALL);
  const [selectedName, setSelectedName] = useState("React");

  // The terminal's "stack --details <tool>" command selects a tool from outside this section.
  useEffect(() => {
    function onSelect(event: Event) {
      const { name } = (event as CustomEvent<SelectSkillDetail>).detail;
      if (!allSkills.some((skill) => skill.name === name)) return;
      setFilter(ALL);
      setSelectedName(name);
    }
    window.addEventListener(SELECT_SKILL_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SKILL_EVENT, onSelect);
  }, []);

  const matches = (usedIn: string[]) => filter === ALL || usedIn.includes(filter);
  const selected = allSkills.find((skill) => skill.name === selectedName) ?? coreSkills[0];
  const SelectedIcon = skillIcons[selected.name].Icon;

  return (
    <section id="skills" aria-labelledby="skills-heading" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="skills-heading" label="Tech stack" title="The stack behind the work" />
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          What I build with in production, and where each tool shows up. Pick a project to see its stack.
        </p>

        <Reveal className="mt-8">
          <div role="group" aria-label="Show tools used in a project" className="flex flex-wrap gap-2">
            {filters.map((name) => {
              const isActive = filter === name;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setFilter(name);
                    if (name !== ALL && !selected.usedIn.includes(name)) {
                      const first = coreSkills.find((skill) => skill.usedIn.includes(name));
                      if (first) setSelectedName(first.name);
                    }
                  }}
                  className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${
                    isActive
                      ? "border-accent bg-accent font-medium text-on-accent"
                      : "border-line text-muted hover:bg-elevated hover:text-ink"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <aside
              aria-live="polite"
              aria-label="Selected tool"
              className="card spotlight p-5 lg:sticky lg:top-24 lg:order-2 lg:p-6"
            >
              <div key={selected.name} className="term-entry">
                <div className="flex items-center gap-4">
                  <span
                    className="tool-icon grid size-12 flex-none place-items-center rounded-xl bg-elevated lg:size-16"
                    style={brandStyle(selected.name)}
                  >
                    <SelectedIcon className="size-7 lg:size-9" aria-hidden />
                  </span>
                  <div>
                    <p className="font-display text-xl leading-tight font-semibold lg:text-2xl">{selected.name}</p>
                    <p className="eyebrow mt-1">{selected.category}</p>
                  </div>
                </div>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{selected.context}</p>
                {selected.usedIn.length > 0 && (
                  <div className="mt-4">
                    <p className="eyebrow uppercase">Used in</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {selected.usedIn.map((place) => (
                        <li key={place}>
                          <a
                            href={projectHref[place]}
                            className="block rounded-md bg-accent-soft px-2 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-on-accent"
                          >
                            {place}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            <div className="lg:order-1">
              <h3 className="eyebrow uppercase">Core stack</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {coreSkills.map((skill) => {
                  const { Icon } = skillIcons[skill.name];
                  const isSelected = skill.name === selected.name;
                  const isMatch = matches(skill.usedIn);
                  return (
                    <li key={skill.name} className={`transition-opacity duration-300 ${isMatch ? "" : "opacity-35"}`}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedName(skill.name)}
                        // On desktop, hovering previews a tool; clicking still works everywhere.
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") setSelectedName(skill.name);
                        }}
                        style={brandStyle(skill.name)}
                        className={`tool-tile card spotlight flex w-full items-center gap-4 p-4 text-left ${isSelected ? "is-selected" : ""}`}
                      >
                        <span className="tool-icon grid size-11 flex-none place-items-center rounded-lg bg-elevated">
                          <Icon className="size-6" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium">{skill.name}</span>
                          <span className="mt-0.5 block truncate text-xs text-muted">{skill.usedIn.join(" · ")}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <h3 className="eyebrow mt-8 uppercase">Also worked with</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {otherSkills.map((skill) => {
                  const { Icon } = skillIcons[skill.name];
                  return (
                    <li
                      key={skill.name}
                      title={skill.context}
                      style={brandStyle(skill.name)}
                      aria-current={skill.name === selected.name ? "true" : undefined}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-[opacity,border-color,background-color] duration-300 ${
                        matches(skill.usedIn) ? "" : "opacity-35"
                      } ${skill.name === selected.name ? "border-accent bg-accent-soft" : "border-line"}`}
                    >
                      <span className="tool-icon">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      {skill.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
