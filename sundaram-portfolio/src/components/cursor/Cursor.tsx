"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const INTERACTIVE = "a, button, [role='button'], label, summary, [data-particle-stage]";
const MIN_PRESS_MS = 170;

/** A mechanical pointing hand. The fingertip at (14, 1) in the viewBox is the hotspot. */
function RobotHand() {
  return (
    <svg viewBox="0 0 48 66" width="40" height="55" fill="none" stroke="#20212a" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      {/* Curled fingers */}
      <rect x="20" y="24" width="7" height="12" rx="3" fill="#aeb0bd" />
      <rect x="27" y="26" width="7" height="11" rx="3" fill="#aeb0bd" />
      <rect x="34" y="28" width="7" height="10" rx="3" fill="#9a9caa" />
      {/* Thumb */}
      <path d="M8 40 2.5 33a3.4 3.4 0 0 1 5-4.6L13 34Z" fill="#aeb0bd" />
      {/* Palm */}
      <path d="M8 32h34a2 2 0 0 1 2 2v12l-5 8H15l-7-8Z" fill="#d5d7e0" />
      <path d="M14 39h22" stroke="#8d8f9d" strokeWidth="1.2" />
      <circle className="hand-led" cx="26" cy="46" r="3.2" fill="#a78bfa" />
      {/* Wrist */}
      <rect x="15" y="54" width="24" height="9" rx="2" fill="#8d8f9d" />
      <circle cx="20" cy="58.5" r="1.1" fill="#20212a" stroke="none" />
      <circle cx="34" cy="58.5" r="1.1" fill="#20212a" stroke="none" />
      {/* Pointing finger: compresses toward the palm on press */}
      <g className="hand-finger">
        <rect x="9.5" y="20" width="9" height="14" rx="3" fill="#d5d7e0" />
        <circle cx="14" cy="20" r="2.4" fill="#8d8f9d" />
        <rect x="10" y="1" width="8" height="18" rx="4" fill="#eceef4" />
        <rect className="hand-tip" x="10" y="1" width="8" height="6" rx="3.5" fill="#a78bfa" />
      </g>
    </svg>
  );
}

export function Cursor() {
  const enabled = useMediaQuery(
    "(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  );
  const hand = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  // A modal dialog renders in the top layer, so the hand has to live inside it to stay visible.
  const [host, setHost] = useState<HTMLElement | null>(null);

  // Moving between the page and a dialog remounts the hand, so restore where it was.
  useLayoutEffect(() => {
    if (!hand.current) return;
    hand.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
    hand.current.style.opacity = "1";
  }, [host]);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    let releaseTimer = 0;
    let pressedAt = 0;

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      position.current = { x: event.clientX, y: event.clientY };
      setHost(document.querySelector<HTMLElement>("dialog[open]"));
      root.classList.add("custom-cursor");

      const element = hand.current;
      if (!element) return;
      element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      const target = event.target as Element | null;
      // Text fields keep the native text cursor.
      element.style.opacity = target?.closest?.("input, textarea") ? "0" : "1";
      element.dataset.active = String(Boolean(target?.closest?.(INTERACTIVE)));
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !hand.current) return;
      window.clearTimeout(releaseTimer);
      pressedAt = performance.now();
      hand.current.dataset.pressed = "true";

      const ripple = document.createElement("span");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      (document.querySelector("dialog[open]") ?? document.body).append(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    }

    function onPointerUp() {
      // A quick click still shows the whole poke.
      const wait = Math.max(0, MIN_PRESS_MS - (performance.now() - pressedAt));
      releaseTimer = window.setTimeout(() => {
        if (hand.current) hand.current.dataset.pressed = "false";
      }, wait);
    }

    function onLeave() {
      if (hand.current) hand.current.style.opacity = "0";
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    root.addEventListener("mouseleave", onLeave);
    return () => {
      window.clearTimeout(releaseTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("mouseleave", onLeave);
      root.classList.remove("custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const element = (
    <div ref={hand} className="cursor-hand" aria-hidden="true">
      <div className="cursor-hand-pose">
        <RobotHand />
      </div>
    </div>
  );
  return host ? createPortal(element, host) : element;
}
