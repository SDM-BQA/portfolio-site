import { ArrowLeft, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { profile } from "@/data/profile";
import { getProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const title = `${project.name} case study | ${profile.name}`;
  return {
    title,
    description: project.summary,
    ...(process.env.NEXT_PUBLIC_SITE_URL ? { alternates: { canonical: `/projects/${project.slug}` } } : {}),
    openGraph: { title, description: project.summary, type: "article" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <article className="shell pt-28 pb-16 md:pt-36 md:pb-24">
      <Link href="/#projects" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        All projects
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className={`eyebrow ${project.category === "Professional work" ? "text-accent" : ""}`}>
          {project.category} · {project.period}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">{project.name}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">{project.summary}</p>
        <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <li key={item} className="tag">
              {item}
            </li>
          ))}
        </ul>
        {project.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((link, index) => (
              <ExternalLink key={link.href} href={link.href} className={`btn ${index === 0 ? "btn-primary" : "btn-ghost"}`}>
                {link.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </ExternalLink>
            ))}
          </div>
        )}
      </header>

      {project.outcome && (
        <aside className="card mt-10 max-w-3xl border-l-2 border-l-accent p-6">
          <p className="eyebrow uppercase">{project.outcome.label}</p>
          <p className="font-display mt-2 text-xl leading-snug font-medium md:text-2xl">{project.outcome.text}</p>
        </aside>
      )}

      <div className="mt-12 max-w-3xl space-y-10">
        {project.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
            {section.body && <p className="mt-3 text-lg leading-relaxed text-muted">{section.body}</p>}
            {section.flow && (
              <ol className="mt-4 flex flex-wrap items-center gap-2">
                {section.flow.map((step, index) => (
                  <li key={step} className="flex items-center gap-2">
                    {index > 0 && <ArrowRight className="size-4 text-muted" aria-hidden="true" />}
                    <span className="rounded-lg border border-line bg-surface px-3 py-2 font-mono text-[0.8125rem]">{step}</span>
                  </li>
                ))}
              </ol>
            )}
            {section.items && (
              <ul className="mt-3 space-y-2 text-lg leading-relaxed text-muted">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] size-1 flex-none rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {project.note && (
        <p className="mt-10 flex max-w-3xl gap-2.5 text-sm leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 size-4 flex-none" aria-hidden="true" />
          {project.note}
        </p>
      )}

      <nav aria-label="Next project" className="mt-14 max-w-3xl border-t border-line pt-6">
        <Link href={`/projects/${next.slug}`} className="group inline-flex min-h-10 items-center gap-2 font-medium">
          Next: {next.name}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </nav>
    </article>
  );
}
