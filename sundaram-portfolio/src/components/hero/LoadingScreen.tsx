"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { degrees, roles } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { hasIntroPlayed, LOADER_MS, markLoaderDone } from "./intro";

const EXIT_MS = 450;
const toolCount = skillGroups.reduce((sum, group) => sum + group.skills.length, 0);

// The counts come from the site's own content, so the log is true.
const STEPS = [
  { label: "loading design tokens", detail: "light + dark" },
  { label: "mounting experience", detail: `${roles.length} roles` },
  { label: "compiling projects", detail: `${projects.length} case studies` },
  { label: "resolving education", detail: `${degrees.length} degrees` },
  { label: "linking tools", detail: `${toolCount} packages` },
];

/**
 * A first-load init screen. It is in the server HTML so it covers the first paint,
 * but CSS only shows it when the inline script set html.boot: a plain visit to or
 * reload of the home page, with JavaScript and motion allowed. Links arriving at a
 * section go straight to content.
 */
export function LoadingScreen() {
  const [phase, setPhase] = useState<"running" | "leaving" | "done">(() => (hasIntroPlayed() ? "done" : "running"));
  const rootRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const finished = useRef(false);

  const finishRef = useRef(() => {
    if (finished.current) return;
    finished.current = true;
    markLoaderDone();
    setPhase("leaving");
    window.setTimeout(() => setPhase("done"), EXIT_MS);
  });

  useEffect(() => {
    const showing =
      document.documentElement.classList.contains("boot") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!showing || hasIntroPlayed()) {
      finished.current = true;
      markLoaderDone();
      const frame = requestAnimationFrame(() => setPhase("done"));
      return () => cancelAnimationFrame(frame);
    }

    // Everything starts together here, so a slow page load can't eat into the sequence.
    if (rootRef.current) rootRef.current.dataset.run = "";
    const startedAt = performance.now();
    let frame = 0;
    const update = () => {
      const progress = Math.min(1, (performance.now() - startedAt) / LOADER_MS);
      if (percentRef.current) percentRef.current.textContent = `${Math.round(progress * 100)}%`;
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    const timer = window.setTimeout(finishRef.current, LOADER_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div ref={rootRef} data-loader data-leaving={phase === "leaving" ? "" : undefined} className="loader">
      <div aria-hidden="true" className="loader-grid" />
      <div aria-hidden="true" className="w-full max-w-xl px-6">
        <p className="loader-wordmark font-display text-4xl font-bold tracking-tight md:text-6xl">
          SUNDARAM<span className="text-accent">.DEV</span>
        </p>

        <div className="mt-8 font-mono text-[0.8125rem] leading-7 md:text-sm">
          <p className="loader-line" style={{ "--step": 0 } as CSSProperties}>
            <span className="text-accent">$</span> npm run init <span className="text-muted">--project portfolio</span>
          </p>
          {STEPS.map((step, index) => (
            <p key={step.label} className="loader-line flex justify-between gap-4" style={{ "--step": index + 1 } as CSSProperties}>
              <span>
                <span className="text-success">✓</span> {step.label}
              </span>
              <span className="text-muted">{step.detail}</span>
            </p>
          ))}
          <p className="loader-line text-accent" style={{ "--step": STEPS.length + 1 } as CSSProperties}>
            ready. welcome.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
            <div className="loader-bar h-full origin-left rounded-full bg-accent" />
          </div>
          <span ref={percentRef} className="w-10 text-right font-mono text-xs text-muted tabular-nums">
            0%
          </span>
        </div>
      </div>

      <button type="button" onClick={() => finishRef.current()} className="absolute right-5 bottom-5 min-h-10 rounded-md px-3 font-mono text-xs text-muted transition-colors hover:text-ink">
        Skip intro
      </button>
    </div>
  );
}
