import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";
import { ContactComposer } from "./ContactComposer";
import { LocalTime } from "./LocalTime";

const channels = [
  { label: "LinkedIn", detail: "Professional profile", href: profile.linkedin, Icon: LinkedInIcon },
  { label: "GitHub", detail: "Code and projects", href: profile.github, Icon: GitHubIcon },
  { label: "Resume", detail: "Full history as a PDF", href: profile.resume, Icon: FileText },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative isolate overflow-x-clip py-16 md:py-28">
      <div aria-hidden="true" className="contact-glow absolute inset-0 -z-10" />
      <div className="shell">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            Contact
          </p>
          <h2 id="contact-heading" className="mt-3 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
            Let&apos;s talk about what you&apos;re <span className="text-accent">building</span>.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Build your message like an API request, then send it from your own inbox. Or use whichever channel suits you.
          </p>
        </Reveal>

        <div className="mt-10 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Reveal>
            <ContactComposer />
          </Reveal>

          <Reveal delay={0.1} className="grid gap-3">
            <div className="card spotlight p-4">
              <p className="flex items-center gap-2 text-sm text-muted">
                <Mail className="size-4 flex-none" aria-hidden="true" />
                Email
              </p>
              <a href={`mailto:${profile.email}`} className="text-link mt-1 block text-sm font-medium wrap-anywhere">
                {profile.email}
              </a>
              <div className="mt-3">
                <CopyEmail className="btn btn-ghost w-full" />
              </div>
            </div>
            <ul className="grid gap-3">
              {channels.map(({ label, detail, href, Icon }) => (
                <li key={label}>
                  <ExternalLink
                    href={href}
                    className="card spotlight group flex items-center gap-3 p-4 transition-colors hover:border-accent hover:bg-elevated"
                  >
                    <Icon className="size-5 flex-none" aria-hidden="true" />
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
            <LocalTime />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
