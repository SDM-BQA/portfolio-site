import { ArrowUpRight, Compass, Layers } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";

const [lead, acrossTheStack, beyondCoding] = profile.bio;

const pillars = [
  { title: "Across the stack", text: acrossTheStack, Icon: Layers },
  { title: "Always exploring", text: beyondCoding, Icon: Compass },
];

const profileLinks = [
  { label: "GitHub", detail: "Personal projects and source code", href: profile.github, Icon: GitHubIcon },
  { label: "LinkedIn", detail: "Professional profile and history", href: profile.linkedin, Icon: LinkedInIcon },
];

const card: { key: string; value: string | readonly string[] }[] = [
  { key: "name", value: profile.name },
  { key: "role", value: profile.role },
  { key: "location", value: profile.location },
  { key: "currently", value: "Helpee Elder Care" },
  { key: "coreStack", value: profile.coreStack },
];

function Value({ value }: { value: string | readonly string[] }) {
  if (typeof value === "string") return <span className="text-success">&quot;{value}&quot;</span>;
  return (
    <>
      <span className="text-muted">[</span>
      {value.map((item, index) => (
        <span key={item}>
          <span className="text-success">&quot;{item}&quot;</span>
          {index < value.length - 1 && <span className="text-muted">, </span>}
        </span>
      ))}
      <span className="text-muted">]</span>
    </>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-16 md:py-24">
      <div className="shell">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            About me
          </p>
          <h2 id="about-heading" className="mt-4 max-w-4xl text-2xl leading-snug font-medium tracking-tight md:text-4xl md:leading-tight">
            {lead}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          <div className="grid content-start gap-5">
            {pillars.map(({ title, text, Icon }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <article className="card spotlight p-6">
                  <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <aside aria-label="Profile summary" className="card overflow-hidden shadow-(--shadow)">
              <div className="flex items-center gap-2 border-b border-line bg-elevated px-4 py-2.5">
                <span aria-hidden="true" className="size-2.5 rounded-full bg-line" />
                <span aria-hidden="true" className="size-2.5 rounded-full bg-line" />
                <span aria-hidden="true" className="size-2.5 rounded-full bg-accent" />
                <p className="ml-2 font-mono text-xs text-muted">sundaram.json</p>
              </div>
              <div className="px-2 py-4 font-mono text-[0.8125rem] leading-relaxed md:text-sm">
                <p aria-hidden="true" className="px-3 text-muted">
                  {"{"}
                </p>
                <dl>
                  {card.map(({ key, value }) => (
                    <div key={key} className="rounded-md py-0.5 pr-3 pl-7 transition-colors hover:bg-accent-soft">
                      <dt className="inline text-accent">&quot;{key}&quot;: </dt>
                      <dd className="inline wrap-anywhere">
                        <Value value={value} />
                      </dd>
                    </div>
                  ))}
                </dl>
                <p aria-hidden="true" className="px-3 text-muted">
                  {"}"}
                </p>
              </div>
              <div className="border-t border-line p-4">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {profileLinks.map(({ label, detail, href, Icon }) => (
                    <li key={label}>
                      <ExternalLink
                        href={href}
                        className="group flex h-full items-center gap-3 rounded-lg border border-line p-3 transition-colors hover:border-accent hover:bg-elevated"
                      >
                        <Icon className="size-5 flex-none" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{label}</span>
                          <span className="block text-xs text-muted">{detail}</span>
                        </span>
                        <ArrowUpRight
                          className="size-4 flex-none text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </ExternalLink>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <CopyEmail className="btn btn-ghost w-full" />
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
