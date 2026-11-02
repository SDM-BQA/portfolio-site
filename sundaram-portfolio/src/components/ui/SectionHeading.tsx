import { Reveal } from "./Reveal";

export function SectionHeading({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <Reveal>
      <p className="eyebrow flex items-center gap-3 uppercase">
        <span aria-hidden="true" className="h-px w-8 bg-accent" />
        {label}
      </p>
      <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}
