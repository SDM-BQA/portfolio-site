import { ArrowUpRight, FileText } from "lucide-react";
import type { CSSProperties } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";
import { ContactTerminal } from "./ContactTerminal";

const handle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** `brand` tints the card on hover; monochrome marks fall back to the accent. */
const channels = [
  { label: "LinkedIn", detail: "Connect or message me", handle: handle(profile.linkedin), href: profile.linkedin, Icon: LinkedInIcon, brand: "#0A66C2" },
  { label: "GitHub", detail: "Code and projects", handle: handle(profile.github), href: profile.github, Icon: GitHubIcon },
  { label: "Resume", detail: "Full history as a PDF", handle: "resume.pdf", href: profile.resume, Icon: FileText },
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
            Have an idea? <span className="text-accent">Let&apos;s build it.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Whether it&apos;s a role, a project or just a question, my inbox is open.
          </p>
        </Reveal>

        {/* Both columns open with a label and stretch to the same height, so their edges line up. */}
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
          <Reveal delay={0.05} className="flex min-w-0 flex-col">
            <p className="eyebrow uppercase">Write to me</p>
            <div className="mt-3 flex-1">
              <ContactTerminal />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="flex flex-col">
            <p className="eyebrow uppercase">Or find me on</p>
            <ul className="mt-3 grid flex-1 grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {channels.map(({ label, detail, handle, href, Icon, brand }) => (
                <li key={label}>
                  <ExternalLink
                    href={href}
                    style={brand ? ({ "--brand": brand } as CSSProperties) : undefined}
                    className="contact-channel card spotlight group flex h-full items-center gap-4 p-4"
                  >
                    <span className="contact-channel-icon grid size-11 flex-none place-items-center rounded-xl bg-elevated">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{label}</span>
                      <span className="block truncate font-mono text-xs text-muted">{handle}</span>
                      <span className="sr-only">: {detail}</span>
                    </span>
                    <ArrowUpRight
                      className="size-4 flex-none text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
