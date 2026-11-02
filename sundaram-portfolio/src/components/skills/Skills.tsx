"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/skills";
import { skillIcons } from "./skillIcons";

const ALL = "All";
const filters = [ALL, ...skillGroups.map((group) => group.category)];
const allSkills = skillGroups.flatMap((group) => group.skills.map((skill) => ({ ...skill, category: group.category })));

export function Skills() {
  const [filter, setFilter] = useState(ALL);
  const [selectedName, setSelectedName] = useState("React");

  const visible = filter === ALL ? allSkills : allSkills.filter((skill) => skill.category === filter);
  const selected = allSkills.find((skill) => skill.name === selectedName) ?? allSkills[0];
  const SelectedIcon = skillIcons[selected.name].Icon;

  return (
    <section id="skills" aria-labelledby="skills-heading" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="skills-heading" label="Technical expertise" title="Tools I use" />
        <p className="mt-4 max-w-xl leading-relaxed text-muted">Select a tool to see where it fits in my work.</p>

        <Reveal className="mt-8">
          <div role="group" aria-label="Filter tools by category" className="flex flex-wrap gap-2">
            {filters.map((name) => {
              const isActive = filter === name;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setFilter(name);
                    const first = allSkills.find((skill) => skill.category === name);
                    if (first && selected.category !== name) setSelectedName(first.name);
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
              className="card spotlight sticky top-20 z-10 p-5 max-lg:min-h-44 lg:top-24 lg:order-2 lg:p-6"
            >
              <div key={selected.name} className="term-entry">
                <div className="flex items-center gap-4">
                  <span
                    className="tool-icon grid size-12 flex-none place-items-center rounded-xl bg-elevated lg:size-16"
                    style={skillIcons[selected.name].color ? ({ "--brand": skillIcons[selected.name].color } as CSSProperties) : undefined}
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
                        <li key={place} className="rounded-md bg-accent-soft px-2 py-1 text-xs font-medium">
                          {place}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:order-1 xl:grid-cols-5">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((skill) => {
                  const { Icon, color } = skillIcons[skill.name];
                  const isSelected = skill.name === selected.name;
                  return (
                    <motion.li
                      key={skill.name}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedName(skill.name)}
                        style={color ? ({ "--brand": color } as CSSProperties) : undefined}
                        className={`tool-tile card spotlight flex aspect-square w-full flex-col items-center justify-center gap-2 p-2 text-center ${
                          isSelected ? "is-selected" : ""
                        }`}
                      >
                        <span className="tool-icon">
                          <Icon className="size-7 md:size-8" aria-hidden />
                        </span>
                        <span className="text-xs leading-tight font-medium md:text-[0.8125rem]">{skill.name}</span>
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
