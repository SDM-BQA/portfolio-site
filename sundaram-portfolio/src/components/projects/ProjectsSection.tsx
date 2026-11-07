import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RepoBadge } from "@/components/ui/RecentActivity";
import { projects, type Project } from "@/data/projects";
import { getGitHubActivity } from "@/lib/github";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectPreview } from "./ProjectPreview";

type Repo = { pushedAt: string; stars: number } | undefined;

function Stack({ items }: { items: string[] }) {
  return (
    <ul aria-label="Technologies" className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="tag">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
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
  );
}

/** The name links to the case study and stretches over the whole block, so all of it is clickable. */
function Title({ project, className }: { project: Project; className: string }) {
  return (
    <h3 className={`font-semibold tracking-tight ${className}`}>
      <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-[0.875rem] after:content-['']">
        {project.name}
      </Link>
    </h3>
  );
}

/** Professional work leads, with its result. Internal screenshots can't be shown, so it uses its workflow. */
function Featured({ project }: { project: Project }) {
  return (
    <article className="card project-card spotlight relative flex flex-col gap-8 p-6 md:p-8 lg:flex-row lg:items-stretch lg:gap-10">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="eyebrow text-accent">{project.category}</p>
          <p className="eyebrow">{project.period}</p>
        </div>
        <Title project={project} className="mt-4 text-3xl md:text-4xl" />
        <p className="mt-3 flex-1 leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-5">
          <Stack items={project.stack} />
        </div>
        <div className="mt-6 border-t border-line pt-4">
          <Links project={project} />
        </div>
      </div>

      <div className="flex flex-col justify-center gap-5 rounded-xl bg-highlight-soft p-6 lg:w-[42%]">
        {project.outcome && (
          <div>
            <p className="eyebrow text-highlight uppercase">{project.outcome.label}</p>
            <p className="font-display mt-2 text-xl leading-snug font-medium md:text-2xl">{project.outcome.text}</p>
          </div>
        )}
        <ProjectPreview slug={project.slug} />
      </div>
    </article>
  );
}

/** Personal projects alternate picture and text, so the list reads as a sequence rather than a grid. */
function Row({ project, index, repo }: { project: Project; index: number; repo: Repo }) {
  const flipped = index % 2 === 1;
  return (
    <article className="project-row relative grid grid-cols-[minmax(0,1fr)] items-center gap-6 py-10 md:grid-cols-2 md:gap-12 md:py-14">
      <div className={flipped ? "md:order-2" : undefined}>
        <ProjectMedia slug={project.slug} liveUrl={project.links.find((link) => link.label === "Live demo")?.href} />
      </div>
      <div className="min-w-0">
        <p className="eyebrow">
          {project.category} · {project.period}
        </p>
        <Title project={project} className="mt-3 text-2xl md:text-3xl" />
        {repo && (
          <div className="mt-2">
            <RepoBadge pushedAt={repo.pushedAt} stars={repo.stars} />
          </div>
        )}
        <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>
        {project.outcome && (
          <p className="mt-4 border-l-2 border-highlight pl-3 text-sm leading-relaxed">
            <span className="font-medium text-highlight">{project.outcome.label}: </span>
            {project.outcome.text}
          </p>
        )}
        <div className="mt-5">
          <Stack items={project.stack} />
        </div>
        <div className="mt-6">
          <Links project={project} />
        </div>
      </div>
    </article>
  );
}

export async function ProjectsSection() {
  const activity = await getGitHubActivity();
  const [featured, ...rest] = projects;
  const repoFor = (project: Project): Repo => (project.repo ? activity?.repos[project.repo.toLowerCase()] : undefined);

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="projects-heading" label="Featured projects" title="Work that solves a real problem" />
        <Reveal className="mt-10">
          <Featured project={featured} />
        </Reveal>
        <ul className="mt-6 divide-y divide-line border-b border-line">
          {rest.map((project, index) => (
            <li key={project.slug}>
              <Reveal delay={0.05}>
                <Row project={project} index={index} repo={repoFor(project)} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
