"use client";

import { Pause, Play } from "lucide-react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const PHRASES = ["I build web experiences.", "I engineer digital products.", "I solve real problems."];
const LONGEST = PHRASES[1];
const TYPE_MS = 60;
const DELETE_MS = 28;
const HOLD_MS = 1800;
const GAP_MS = 350;

/** A looping typewriter. It stops off-screen and has a pause control, as WCAG 2.2.2 requires. */
export function RotatingPhrase() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [phrase, setPhrase] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (reduced || paused || !inView) return;
    const full = PHRASES[phrase];
    let delay = deleting ? DELETE_MS : TYPE_MS;
    let step = () => setLength((value) => value + (deleting ? -1 : 1));

    if (!deleting && length === full.length) {
      delay = HOLD_MS;
      step = () => setDeleting(true);
    } else if (deleting && length === 0) {
      delay = GAP_MS;
      step = () => {
        setDeleting(false);
        setPhrase((value) => (value + 1) % PHRASES.length);
      };
    }

    const timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
  }, [phrase, length, deleting, paused, reduced, inView]);

  const text = reduced ? PHRASES[2] : PHRASES[phrase].slice(0, length);

  return (
    <span className="flex items-center gap-3">
      <span className="sr-only">{PHRASES.join(" ")}</span>
      <span ref={ref} aria-hidden="true" className="grid">
        <span className="invisible col-start-1 row-start-1">{LONGEST}</span>
        <span data-typewriter className="col-start-1 row-start-1 text-accent">
          {text}
          {!reduced && <span className={`type-caret ${paused ? "" : "is-live"}`} />}
        </span>
        <noscript>
          <span className="col-start-1 row-start-1 text-accent">{PHRASES[2]}</span>
        </noscript>
      </span>
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Resume typing animation" : "Pause typing animation"}
          className="grid size-7 flex-none place-items-center rounded-md text-muted transition-colors hover:bg-elevated hover:text-ink"
        >
          {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
        </button>
      )}
    </span>
  );
}
