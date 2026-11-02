"use client";

import { Pause, Play } from "lucide-react";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { whenLoaderDone } from "./intro";
import { SHAPES } from "./particleField";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const AUTO_MORPH_MS = 4500;
const INTERACTION_HOLD_MS = 8000;

/** A WebGL or chunk-load failure leaves the static artwork in place (AC-13). */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Shown with reduced motion, while the 3D chunk loads, and if WebGL fails. */
function StaticMark({ hidden }: { hidden: boolean }) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={`absolute inset-0 m-auto size-full transition-opacity duration-500 ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <defs>
        <pattern id="mark-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="2" fill="var(--accent)" />
        </pattern>
      </defs>
      <text x="200" y="262" textAnchor="middle" fontFamily="var(--font-space-grotesk)" fontWeight="700" fontSize="170" fill="url(#mark-dots)">
        {"</>"}
      </text>
    </svg>
  );
}

export function HeroVisual() {
  const wantsScene = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const [ready, setReady] = useState(false);
  const [shape, setShape] = useState(0);
  const [paused, setPaused] = useState(false);
  const nextMorphAt = useRef(0);
  const [loaderDone, setLoaderDone] = useState(false);

  // Keeps the loading screen smooth, and the particles gather just as the site appears.
  useEffect(() => whenLoaderDone(() => setLoaderDone(true)), []);

  // Morphs on an interval, holding off briefly while the visitor is playing with it.
  useEffect(() => {
    if (!ready || paused) return;
    nextMorphAt.current = Date.now() + AUTO_MORPH_MS;
    const timer = window.setInterval(() => {
      if (Date.now() < nextMorphAt.current) return;
      nextMorphAt.current = Date.now() + AUTO_MORPH_MS;
      setShape((value) => (value + 1) % SHAPES.length);
    }, 250);
    return () => window.clearInterval(timer);
  }, [ready, paused]);

  const holdAutoMorph = () => {
    nextMorphAt.current = Date.now() + INTERACTION_HOLD_MS;
  };

  const active = SHAPES[shape];

  return (
    <div className="mx-auto w-full max-w-[20rem] md:max-w-sm lg:max-w-[30rem]">
      <div className="relative aspect-square w-full">
        <StaticMark hidden={ready} />
        {wantsScene && loaderDone && (
          <SceneBoundary>
            <HeroScene
              shape={shape}
              onReady={() => setReady(true)}
              onInteract={holdAutoMorph}
              onAdvance={() => {
                holdAutoMorph();
                setShape((value) => (value + 1) % SHAPES.length);
              }}
            />
          </SceneBoundary>
        )}
      </div>

      {/* Only offered once the scene is running, since they control nothing without it. */}
      {ready && (
        <div className="mt-2 text-center">
          <div className="flex items-center justify-center gap-1.5">
          <div role="group" aria-label="Choose a shape" className="flex flex-wrap justify-center gap-1.5">
            {SHAPES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={index === shape}
                onClick={() => {
                  holdAutoMorph();
                  setShape(index);
                }}
                className={`min-h-9 rounded-full border px-3 font-mono text-xs transition-colors ${
                  index === shape
                    ? "border-accent bg-accent font-medium text-on-accent"
                    : "border-line bg-surface text-muted hover:border-accent hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Resume automatic shape changes" : "Pause automatic shape changes"}
              className="grid size-9 flex-none place-items-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-ink"
            >
              {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
            </button>
          </div>
          <p className="mt-2 min-h-5 text-sm text-muted">{active.caption}</p>
          <p className="eyebrow mt-1 max-md:hidden" aria-hidden="true">
            move to scatter · click to morph · drag to spin
          </p>
          <p className="eyebrow mt-1 md:hidden" aria-hidden="true">
            tap to morph
          </p>
        </div>
      )}
    </div>
  );
}
