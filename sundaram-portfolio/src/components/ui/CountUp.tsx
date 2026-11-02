"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Server output and reduced-motion output are the real value; only the on-view animation counts. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(value * 0.6, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (current) => {
        if (ref.current) ref.current.textContent = current.toFixed(2);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {value.toFixed(2)}
    </span>
  );
}
