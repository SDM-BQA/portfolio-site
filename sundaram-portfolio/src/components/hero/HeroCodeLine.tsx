"use client";

import { useEffect, useState } from "react";
import { DECODE_MS, hasIntroPlayed, onNameReplay, REVEAL_DELAY_MS } from "./intro";

// The hex really is "Sundaram" in ASCII.
const CALL = 'const name = decode("53 75 6e 64 61 72 61 6d");';
const RESULT = ' // "Sundaram"';
const TYPE_MS = 18;
const RESULT_HOLD_MS = 1400;
const FADE_MS = 500;

/**
 * Decorative: types the call that "decodes" the name below it, then fades away. It
 * sits in a fixed-height slot, so nothing moves when it leaves.
 */
export function HeroCodeLine() {
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing" | "result" | "fading" | "gone">("idle");

  useEffect(() => {
    let timers: number[] = [];
    let interval = 0;

    const clear = () => {
      timers.forEach(window.clearTimeout);
      window.clearInterval(interval);
    };

    const run = (resultAt: number) => {
      clear();
      setTyped(0);
      setPhase("typing");
      timers = [
        window.setTimeout(() => setPhase("result"), resultAt),
        window.setTimeout(() => setPhase("fading"), resultAt + RESULT_HOLD_MS),
        window.setTimeout(() => setPhase("gone"), resultAt + RESULT_HOLD_MS + FADE_MS),
      ];
      interval = window.setInterval(() => {
        setTyped((value) => {
          if (value >= CALL.length) window.clearInterval(interval);
          return Math.min(value + 1, CALL.length);
        });
      }, TYPE_MS);
    };

    if (!hasIntroPlayed() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      run(REVEAL_DELAY_MS + DECODE_MS);
    }
    const stopListening = onNameReplay(() => run(DECODE_MS));

    return () => {
      stopListening();
      clear();
    };
  }, []);

  const hasText = phase !== "idle" && phase !== "gone";
  const code = CALL.slice(0, typed);

  return (
    <p
      aria-hidden="true"
      data-code-line
      className={`mt-3 h-5 whitespace-nowrap font-mono text-[2.5vw] leading-5 text-muted transition-opacity duration-500 sm:text-xs md:text-[0.8125rem] ${
        phase === "fading" ? "opacity-0" : ""
      }`}
    >
      {hasText && (
        <>
          <span className="text-accent">{code.slice(0, 5)}</span>
          {code.slice(5)}
          {phase === "typing" ? (
            <span className="type-caret is-live" />
          ) : (
            <span className="text-success max-sm:hidden">{RESULT}</span>
          )}
        </>
      )}
    </p>
  );
}
