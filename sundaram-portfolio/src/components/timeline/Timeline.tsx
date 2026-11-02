"use client";

import { Briefcase, ChevronRight, TrendingDown } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { roles } from "@/data/experience";

export function Timeline() {
  const [openId, setOpenId] = useState<string | null>(roles[0].id);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0.15, 1]);

  function toggle(id: string, isOpen: boolean) {
    // The desktop detail column should never sit empty, so only stacked layouts collapse.
    if (isOpen && window.matchMedia("(min-width: 1024px)").matches) return;
    setOpenId(isOpen ? null : id);
  }

  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="experience-heading" label="Experience" title="Where I've been building" />
        <p className="mt-4 max-w-xl leading-relaxed text-muted">Select a role to see what I worked on.</p>

        <Reveal className="mt-10">
          <ol ref={listRef} className="exp-list relative" style={{ "--rows": roles.length } as CSSProperties}>
            <span aria-hidden="true" className="exp-line bg-line">
              <motion.span style={{ scaleY: fill }} className="block h-full origin-top bg-accent" />
            </span>

            {roles.map((role) => {
              const isOpen = openId === role.id;
              return (
                <li key={role.id} className="exp-item">
                  <h3 className="exp-trigger relative pb-4 pl-14">
                    <span
                      aria-hidden="true"
                      className={`absolute top-3 left-0 grid size-10 place-items-center rounded-full border transition-colors ${
                        isOpen ? "border-accent bg-accent text-on-accent" : "border-line bg-surface text-muted"
                      }`}
                    >
                      <Briefcase className="size-4" />
                    </span>
                    <button
                      type="button"
                      id={`${role.id}-trigger`}
                      aria-expanded={isOpen}
                      aria-controls={`${role.id}-panel`}
                      onClick={() => toggle(role.id, isOpen)}
                      className={`card spotlight flex w-full items-center justify-between gap-3 p-4 text-left transition-colors ${
                        isOpen ? "border-accent/60 bg-elevated" : "hover:bg-elevated"
                      }`}
                    >
                      <span>
                        <span className="eyebrow block">{role.type}</span>
                        <span className="mt-1 block leading-snug font-semibold">{role.title}</span>
                        <span className="mt-1 block font-sans text-sm font-normal text-muted">{role.period}</span>
                      </span>
                      <ChevronRight
                        aria-hidden="true"
                        className={`size-5 flex-none text-muted transition-transform max-lg:rotate-90 ${isOpen ? "text-accent lg:translate-x-1 max-lg:-rotate-90" : ""}`}
                      />
                    </button>
                  </h3>

                  <div
                    id={`${role.id}-panel`}
                    role="region"
                    aria-labelledby={`${role.id}-trigger`}
                    className="disclosure exp-panel"
                    data-open={isOpen}
                  >
                    <div>
                      <div className="card spotlight mb-4 p-6 max-lg:ml-14 md:p-8 lg:mb-0">
                        <div className="stagger">
                          <p className="font-display text-2xl font-semibold tracking-tight" style={{ "--i": 0 } as CSSProperties}>
                            {role.organisation}
                          </p>
                          <p className="mt-1 text-sm text-muted" style={{ "--i": 1 } as CSSProperties}>
                            {role.title} · {role.location}
                          </p>
                          {role.highlight && (
                            <div className="mt-5 flex gap-3 rounded-lg bg-accent-soft p-4" style={{ "--i": 2 } as CSSProperties}>
                              <TrendingDown className="mt-0.5 size-5 flex-none text-accent" aria-hidden="true" />
                              <p>
                                <span className="eyebrow block uppercase">{role.highlight.label}</span>
                                <span className="font-display mt-1 block text-lg leading-snug font-medium">{role.highlight.text}</span>
                              </p>
                            </div>
                          )}
                        </div>
                        <ul className="stagger mt-5 space-y-3 leading-relaxed text-muted">
                          {role.details.map((detail, index) => (
                            <li key={detail} className="flex gap-3" style={{ "--i": index + 3 } as CSSProperties}>
                              <span aria-hidden="true" className="mt-[0.65em] size-1 flex-none rounded-full bg-accent" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                        <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-1.5">
                          {role.stack.map((item) => (
                            <li key={item} className="tag">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
