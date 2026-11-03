"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

export function Parallax({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  // Drifts upward so the visual never slides into the proof-points band below the hero.
  // With reduced motion the drift is zero rather than removed, so the server and the
  // browser render the same style and hydration matches.
  const y = useTransform(scrollY, [0, 800], reduced ? [0, 0] : [0, -80]);

  return <motion.div style={{ y }}>{children}</motion.div>;
}
