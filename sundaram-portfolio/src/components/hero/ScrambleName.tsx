"use client";

import { useEffect, useRef, useState } from "react";
import { hasIntroPlayed, markIntroPlayed, notifyNameReplay, REVEAL_DELAY_MS, whenLoaderDone } from "./intro";

const GLYPHS = "0123456789abcdef{}<>/=;$#";
const FRAME_MS = 45;
const FRAMES_PER_LETTER = 4;
const SCRAMBLE_ONLY_FRAMES = 8;

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Plays once on page load and again on hover: each letter cycles through code
 * symbols, then resolves left to right. The real letter always reserves its width,
 * so the headline never shifts, and the server-rendered text is the plain name. CSS
 * holds the name back until the first reveal (see "data-scramble" in globals.css).
 */
export function ScrambleName({ name }: { name: string }) {
  const [glyphs, setGlyphs] = useState<(string | null)[]>(() => name.split("").map(() => null));
  const [started, setStarted] = useState(hasIntroPlayed);
  const timer = useRef<number | undefined>(undefined);
  const running = useRef(false);

  function scramble() {
    running.current = true;
    const total = name.length * FRAMES_PER_LETTER + SCRAMBLE_ONLY_FRAMES;
    let frame = 0;

    const step = () => {
      frame += 1;
      const resolved = Math.max(0, Math.floor((frame - SCRAMBLE_ONLY_FRAMES) / FRAMES_PER_LETTER));
      setGlyphs(name.split("").map((_, index) => (frame < total && index >= resolved ? randomGlyph() : null)));
      if (frame < total) timer.current = window.setTimeout(step, FRAME_MS);
      else running.current = false;
    };
    step();
  }

  // The first-load reveal runs once, so it deliberately closes over the first render.
  useEffect(() => {
    if (hasIntroPlayed() || prefersReducedMotion()) return;
    const stopWaiting = whenLoaderDone(() => {
      timer.current = window.setTimeout(() => {
        markIntroPlayed();
        setStarted(true);
        scramble();
      }, REVEAL_DELAY_MS);
    });
    return () => {
      stopWaiting();
      window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function replay() {
    if (!started || running.current || prefersReducedMotion()) return;
    notifyNameReplay();
    scramble();
  }

  return (
    <span onPointerEnter={replay} className="inline-block whitespace-nowrap">
      <span className="sr-only">{name}</span>
      <span aria-hidden="true" data-scramble data-started={started ? "" : undefined}>
        {name.split("").map((letter, index) => {
          const glyph = glyphs[index];
          return (
            <span key={index} className="relative inline-block">
              <span className={glyph ? "invisible" : undefined}>{letter}</span>
              {glyph && (
                <span className="text-accent absolute inset-0 text-center font-mono font-medium">{glyph}</span>
              )}
            </span>
          );
        })}
      </span>
    </span>
  );
}
