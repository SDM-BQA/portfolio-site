import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RepoBadge } from "@/components/ui/RecentActivity";
import { projects } from "@/data/projects";
import { getGitHubActivity } from "@/lib/github";
import { ProjectPreview } from "./ProjectPreview";

export async function ProjectsSection() {
  const activity = await getGitHubActivity();

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="projects-heading" label="Featured projects" title="Work that solves a real problem" />
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => {
            const featured = index === 0;
            // With an odd number of regular cards, the last one fills the row instead of sitting alone.
            const lastAlone = index === projects.length - 1 && (projects.length - 1) % 2 === 1;
            const repo = project.repo ? activity?.repos[project.repo.toLowerCase()] : undefined;
            return (
              <li key={project.slug} className={`flex ${featured || lastAlone ? "md:col-span-2" : ""}`}>
                <Reveal delay={index * 0.08} className="flex w-full">
                  <article
                    className={`card project-card spotlight tilt relative flex w-full flex-col gap-6 p-6 md:p-8 ${
                      featured ? "lg:flex-row lg:items-stretch lg:gap-10" : ""
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <p className={`eyebrow ${project.category === "Professional work" ? "text-accent" : ""}`}>{project.category}</p>
                        <p className="eyebrow">{project.period}</p>
                      </div>
                      <h3 className={`mt-4 font-semibold tracking-tight ${featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`}>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="after:absolute after:inset-0 after:rounded-[0.875rem] after:content-['']"
                        >
                          {project.name}
                        </Link>
                      </h3>
                      {repo && (
                        <div className="mt-2">
                          <RepoBadge pushedAt={repo.pushedAt} stars={repo.stars} />
                        </div>
                      )}
                      <p className="mt-3 flex-1 leading-relaxed text-muted">{project.summary}</p>
                      {!featured && (
                        <div className="mt-5">
                          <ProjectPreview slug={project.slug} />
                        </div>
                      )}
                      <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-1.5">
                        {project.stack.map((item) => (
                          <li key={item} className="tag">
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-sm">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          Read the case study
                          <ArrowRight className="card-arrow size-4" aria-hidden="true" />
                        </span>
                        {project.links.slice(0, 2).map((link) => (
                          <ExternalLink
                            key={link.href}
                            href={link.href}
                            className="relative z-10 inline-flex min-h-6 items-center gap-1 text-muted hover:text-ink"
                          >
                            {link.label}
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </ExternalLink>
                        ))}
                      </div>
                    </div>

                    {featured && (
                      <div className="flex flex-col justify-center gap-4 rounded-xl bg-accent-soft p-6 lg:w-[42%]">
                        {project.outcome && (
                          <div>
                            <p className="eyebrow uppercase">{project.outcome.label}</p>
                            <p className="font-display mt-2 text-xl leading-snug font-medium md:text-2xl">{project.outcome.text}</p>
                          </div>
                        )}
                        <ProjectPreview slug={project.slug} />
                      </div>
                    )}
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
