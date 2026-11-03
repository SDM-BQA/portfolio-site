"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 1000);
  return () => window.clearInterval(timer);
}

/** A real clock, showing only the time in Bengaluru; it says nothing about availability. */
export function LocalTime() {
  const time = useSyncExternalStore(
    subscribe,
    () => formatter.format(new Date()),
    () => "--:--:--",
  );

  return (
    <p className="flex items-center gap-2.5 font-mono text-xs text-muted">
      <span className="live-dot" aria-hidden="true" />
      Bengaluru
      <span role="timer" data-local-time className="text-ink tabular-nums">
        {time}
      </span>
      IST
    </p>
  );
}
