"use client";

import { SquareTerminal } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTerminal } from "./TerminalProvider";
import { TerminalWindow } from "./TerminalWindow";

export function TerminalSection() {
  const { open } = useTerminal();

  return (
    <section id="terminal" aria-labelledby="terminal-heading" className="py-16 md:py-24">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <SectionHeading id="terminal-heading" label="Optional" title="Prefer a command line?" />
          <p className="hidden pb-1 text-sm text-muted md:block">
            Open it from anywhere with <kbd className="tag">Ctrl</kbd> / <kbd className="tag">⌘</kbd> +{" "}
            <kbd className="tag">K</kbd>
          </p>
        </div>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          A simulated terminal for exploring this portfolio. Everything in it also appears elsewhere on the page, so it
          is entirely optional.
        </p>
        <button type="button" onClick={open} className="btn btn-ghost mt-6 md:hidden">
          <SquareTerminal className="size-4" aria-hidden="true" />
          Open terminal
        </button>
        <Reveal className="mt-8 hidden md:block">
          <TerminalWindow demo className="h-[min(46rem,82svh)]" />
        </Reveal>
      </div>
    </section>
  );
}
