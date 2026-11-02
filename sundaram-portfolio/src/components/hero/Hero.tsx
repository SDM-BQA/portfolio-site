import { ArrowDown, FileText } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { profile } from "@/data/profile";
import { CodeRain } from "./CodeRain";
import { HeroCodeLine } from "./HeroCodeLine";
import { HeroVisual } from "./HeroVisual";
import { Parallax } from "./Parallax";
import { RotatingPhrase } from "./RotatingPhrase";
import { ScrambleName } from "./ScrambleName";

const proofPoints = [
  { value: "Est. 70–80%", label: "reduction in unpaid-invoice backlog on closed cases at Helpee" },
  { value: "Phase 1 shipped", label: "caregiver PWA onboarding, built end to end" },
  { value: "Full stack", label: "React, Node.js, GraphQL and MongoDB in production" },
];

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="relative isolate flex min-h-svh flex-col overflow-x-clip pt-24 lg:pt-28">
      <div aria-hidden="true" className="hero-backdrop absolute inset-0 -z-10" />
      <CodeRain />
      <div aria-hidden="true" className="hero-aurora absolute top-[8%] right-[6%] -z-10 size-[34rem] max-w-full rounded-full" />

      <div className="shell grid flex-1 items-center gap-6 pb-10 md:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div>
          <p className="eyebrow hero-in uppercase">
            {profile.role} · {profile.locationShort}
          </p>
          <HeroCodeLine />
          <h1
            id="hero-heading"
            className="hero-in mt-3 text-[clamp(2.75rem,7vw,5.25rem)] leading-[1.02] font-bold tracking-tight"
            style={delay(80)}
          >
            Hey, I&apos;m <ScrambleName name={profile.firstName} />.
          </h1>
          <p
            className="hero-in font-display mt-4 text-[clamp(1.375rem,3vw,2.125rem)] leading-tight font-medium"
            style={delay(160)}
          >
            <RotatingPhrase />
          </p>          <p className="hero-in mt-5 max-w-lg text-lg leading-relaxed text-muted" style={delay(240)}>
            {profile.intro}
          </p>

          <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={delay(320)}>
            <Link href="#experience" className="btn btn-primary magnetic">
              Explore my work
              <ArrowDown className="size-4" aria-hidden="true" />
            </Link>
            <ExternalLink href={profile.resume} className="btn btn-ghost magnetic">
              <FileText className="size-4" aria-hidden="true" />
              Download resume
            </ExternalLink>
            <ExternalLink href={profile.github} className="icon-btn" aria-label="GitHub profile">
              <GitHubIcon className="size-5" />
            </ExternalLink>
            <ExternalLink href={profile.linkedin} className="icon-btn" aria-label="LinkedIn profile">
              <LinkedInIcon className="size-[18px]" />
            </ExternalLink>
          </div>
        </div>

        <div className="hero-in" style={delay(200)}>
          <Parallax>
            <HeroVisual />
          </Parallax>
        </div>
      </div>

      <div className="border-t border-line">
        {/* The bottom padding keeps this text clear of the floating terminal button. */}
        <dl className="shell grid gap-4 pt-5 pb-20 sm:grid-cols-3 sm:gap-8">
          {proofPoints.map((point) => (
            <div key={point.value}>
              <dt className="font-display font-semibold">{point.value}</dt>
              <dd className="mt-0.5 text-sm text-muted">{point.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
