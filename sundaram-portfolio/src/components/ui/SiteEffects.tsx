"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const MAX_TILT_DEG = 4;
const MAX_PULL_PX = 6;

function resetTilt(element: HTMLElement) {
  element.style.setProperty("--rx", "0deg");
  element.style.setProperty("--ry", "0deg");
}

function resetPull(element: HTMLElement) {
  element.style.setProperty("--tx", "0px");
  element.style.setProperty("--ty", "0px");
}

/** One delegated listener drives the spotlight, tilt and magnetic classes across the site. */
function usePointerEffects(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let tilted: HTMLElement | null = null;
    let pulled: HTMLElement | null = null;

    function onPointerMove(event: PointerEvent) {
      const target = event.target as Element | null;

      const glow = target?.closest?.<HTMLElement>(".spotlight");
      if (glow) {
        const rect = glow.getBoundingClientRect();
        glow.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        glow.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }

      const tilt = target?.closest?.<HTMLElement>(".tilt") ?? null;
      if (tilted && tilted !== tilt) resetTilt(tilted);
      tilted = tilt;
      if (tilt) {
        const rect = tilt.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        tilt.style.setProperty("--rx", `${(-y * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
        tilt.style.setProperty("--ry", `${(x * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
      }

      const magnet = target?.closest?.<HTMLElement>(".magnetic") ?? null;
      if (pulled && pulled !== magnet) resetPull(pulled);
      pulled = magnet;
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        magnet.style.setProperty("--tx", `${(x * 2 * MAX_PULL_PX).toFixed(1)}px`);
        magnet.style.setProperty("--ty", `${(y * 2 * MAX_PULL_PX).toFixed(1)}px`);
      }
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, [enabled]);
}

export function SiteEffects() {
  const pointerEffects = useMediaQuery("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  usePointerEffects(pointerEffects);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: progress }}
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent"
    />
  );
}
