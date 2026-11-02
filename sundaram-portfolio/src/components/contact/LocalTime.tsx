"use client";

import { Clock } from "lucide-react";
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
    <div className="card spotlight flex items-center gap-4 p-4">
      <span className="grid size-10 flex-none place-items-center rounded-lg bg-accent-soft text-accent">
        <Clock className="size-5" aria-hidden="true" />
      </span>
      <p className="min-w-0">
        <span className="block text-sm text-muted">Time in Bengaluru (IST)</span>
        <span role="timer" data-local-time className="font-display block text-2xl font-semibold tracking-tight tabular-nums">
          {time}
        </span>
      </p>
    </div>
  );
}
