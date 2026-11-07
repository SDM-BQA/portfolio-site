import { Award, GraduationCap, MapPin } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { degrees } from "@/data/experience";
import { certifications } from "@/data/skills";

export function Education() {
  return (
    <section id="education" aria-labelledby="education-heading" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="education-heading" label="Education" title="Academic foundation" />

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {degrees.map((item, index) => (
            <li key={item.id} className="flex">
              <Reveal delay={index * 0.1} className="flex w-full">
                <article className="card project-card spotlight tilt flex w-full items-start justify-between gap-6 p-6 md:p-8">
                  <div className="min-w-0">
                    <GraduationCap className="size-6 text-accent" aria-hidden="true" />
                    <h3 className="mt-4 text-xl leading-snug font-semibold tracking-tight">{item.degree}</h3>
                    <p className="mt-2 text-muted">{item.institution}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                      <MapPin className="size-3.5 flex-none" aria-hidden="true" />
                      {item.location}
                    </p>
                    <p className="eyebrow mt-3">{item.period}</p>
                  </div>
                  <p className="flex-none text-right">
                    <span className="eyebrow block">CGPA</span>
                    <CountUp value={item.cgpa} className="font-display mt-1 block text-4xl font-bold tracking-tight text-highlight tabular-nums md:text-5xl" />
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12">
          <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Award className="size-5 text-accent" aria-hidden="true" />
            Certifications and achievements
          </h3>
          {/* A ruled list: these are reference details, so they don't need card weight. */}
          <ul className="mt-5 grid gap-x-10 border-t border-line md:grid-cols-2">
            {certifications.map((item) => {
              const [title, issuer] = item.split(" — ");
              return (
                <li key={item} className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="leading-relaxed">{title}</span>
                  <span className="eyebrow flex-none">{issuer ?? "Achievement"}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
