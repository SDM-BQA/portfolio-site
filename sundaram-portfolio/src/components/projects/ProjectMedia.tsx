import { ArrowUpRight, Lock } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { ExternalLink } from "@/components/ui/ExternalLink";
import corelog from "@/assets/projects/corelog.jpg";
import hiveColonyBanner from "@/assets/projects/hivecolony-banner.png";
import paimanaDark from "@/assets/projects/paimana-dark.jpg";
import paimanaLight from "@/assets/projects/paimana-light.jpg";
import { ProjectPreview } from "./ProjectPreview";

/** `background` shows a whole image (such as a wide banner) centred on that colour instead of cropping it. */
type Shot = { light: StaticImageData; dark: StaticImageData; alt: string; background?: string };

/** Screenshots of the public live demos. Paimana has its own light theme, so it follows the site's. */
const shots: Record<string, Shot> = {
  paimana: {
    light: paimanaLight,
    dark: paimanaDark,
    alt: "Paimana's home page: an example result flags haemoglobin low, fasting glucose in range and total cholesterol high.",
  },
  hivecolony: {
    light: hiveColonyBanner,
    dark: hiveColonyBanner,
    alt: "The Hive Colony banner: a glowing beehive inside a golden hexagon, with the tagline \"A shared colony. Survive together.\"",
    background: "radial-gradient(ellipse at center, #241808, #150e04 70%)",
  },
  corelog: {
    light: corelog,
    dark: corelog,
    alt: "CoreLog's dashboard: counts of logged movies, series, books, poetry and journal entries, yearly goals and recently added titles.",
  },
};

const SIZES = "(min-width: 1200px) 560px, (min-width: 768px) 48vw, 100vw";

/** One screenshot, or a light and a dark one that follow the site's theme. */
function Screens({ shot }: { shot: Shot }) {
  if (shot.background) {
    return (
      <div className="grid size-full place-items-center" style={{ background: shot.background }}>
        <Image src={shot.light} alt={shot.alt} sizes={SIZES} placeholder="blur" className="h-auto w-full" />
      </div>
    );
  }
  if (shot.dark === shot.light) {
    return <Image src={shot.light} alt={shot.alt} sizes={SIZES} placeholder="blur" className="size-full object-cover object-top" />;
  }
  return (
    <>
      <Image src={shot.light} alt={shot.alt} sizes={SIZES} placeholder="blur" className="only-light size-full object-cover object-top" />
      <Image src={shot.dark} alt={shot.alt} sizes={SIZES} placeholder="blur" className="only-dark size-full object-cover object-top" />
    </>
  );
}

/** A browser bar with the demo's real address, so the live site is one click from the screenshot. */
function AddressBar({ href }: { href: string }) {
  const host = new URL(href).host;
  return (
    <div className="flex items-center gap-3 border-b border-line bg-surface px-3 py-2">
      <span aria-hidden="true" className="flex gap-1.5 max-sm:hidden">
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
      </span>
      <ExternalLink
        href={href}
        className="group relative z-10 mx-auto flex min-h-6 max-w-full min-w-0 items-center gap-1.5 rounded-md bg-elevated px-3 font-mono text-xs text-muted transition-colors hover:text-accent"
      >
        <Lock className="size-3 flex-none" aria-hidden="true" />
        <span className="truncate">{host}</span>
        <ArrowUpRight className="size-3 flex-none transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </ExternalLink>
      <span aria-hidden="true" className="w-[2.375rem] max-sm:hidden" />
    </div>
  );
}

/** A project's picture: the real product where there is a public demo, otherwise its illustration. */
export function ProjectMedia({ slug, liveUrl }: { slug: string; liveUrl?: string }) {
  const shot = shots[slug];

  if (shot && liveUrl) {
    return (
      <div className="project-media overflow-hidden rounded-xl border border-line bg-elevated">
        <AddressBar href={liveUrl} />
        <div className="relative aspect-[2/1]">
          <Screens shot={shot} />
        </div>
      </div>
    );
  }

  return (
    <div className="project-media relative aspect-[2/1] overflow-hidden rounded-xl border border-line bg-elevated">
      {shot ? (
        <Screens shot={shot} />
      ) : (
        <div className="media-grid grid size-full place-items-center p-6 md:p-10">
          <div className="w-full max-w-sm rounded-[0.625rem] bg-surface shadow-(--shadow)">
            <ProjectPreview slug={slug} />
          </div>
        </div>
      )}
    </div>
  );
}
