"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { subscribeTheme } from "@/lib/theme";

const CHARS = "01{}<>[]()/=;:$#&*+abcdef";
const COLUMN_WIDTH = 30;
const ROW_HEIGHT = 22;
const TRAIL = 10;
const FRAME_MS = 40;
const BASE_ALPHA = 0.3;
const POINTER_RADIUS = 170;

type Column = { x: number; head: number; speed: number; chars: string[] };

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

/** Falling code behind the hero that brightens near the pointer. Purely decorative. */
export function CodeRain() {
  const enabled = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!enabled || !canvas || !context) return;

    let columns: Column[] = [];
    let height = 0;
    let frame = 0;
    let last = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };

    const readColor = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    let color = readColor();
    const unsubscribe = subscribeTheme(() => {
      color = readColor();
    });

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      height = rect.height;
      columns = [];
      for (let x = 8; x < rect.width; x += COLUMN_WIDTH) {
        columns.push({
          x,
          head: Math.random() * (height / ROW_HEIGHT + TRAIL),
          speed: 0.08 + Math.random() * 0.14,
          chars: Array.from({ length: TRAIL }, randomChar),
        });
      }
    }

    function draw(now: number) {
      frame = requestAnimationFrame(draw);
      if (!visible || now - last < FRAME_MS) return;
      last = now;
      context!.clearRect(0, 0, canvas!.width, canvas!.height);
      context!.font = "13px ui-monospace, monospace";
      context!.fillStyle = color;

      for (const column of columns) {
        column.head += column.speed;
        if (column.head - TRAIL > height / ROW_HEIGHT) column.head = -Math.random() * 12;
        if (Math.random() < 0.03) column.chars[Math.floor(Math.random() * TRAIL)] = randomChar();

        for (let index = 0; index < TRAIL; index++) {
          const y = (Math.floor(column.head) - index) * ROW_HEIGHT;
          if (y < 0 || y > height) continue;
          const distance = Math.hypot(column.x - pointer.x, y - pointer.y);
          const boost = Math.max(0, 1 - distance / POINTER_RADIUS);
          context!.globalAlpha = Math.min(1, (1 - index / TRAIL) * BASE_ALPHA + boost * 0.75);
          context!.fillText(column.chars[index], column.x, y);
        }
      }
      context!.globalAlpha = 1;
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    viewObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [enabled]);

  return <canvas ref={canvasRef} data-code-rain aria-hidden="true" className="code-rain absolute inset-x-0 top-0 -z-10 h-[calc(100%-9rem)] w-full" />;
}
