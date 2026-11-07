"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Server output and reduced-motion output are the real value; only the on-view animation counts. */
/** `decimals` defaults to 2 (for CGPA); whole numbers get thousands separators, e.g. 1,470. */
export function CountUp({ value, decimals = 2, className }: { value: number; decimals?: number; className?: string }) {
  const format = (current: number) =>
    decimals === 0 ? Math.round(current).toLocaleString("en-US") : current.toFixed(decimals);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(value * 0.6, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (current) => {
        if (ref.current) ref.current.textContent = format(current);
      },
    });
    return () => controls.stop();
  // `format` only depends on `decimals`, which is already listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value, decimals]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
