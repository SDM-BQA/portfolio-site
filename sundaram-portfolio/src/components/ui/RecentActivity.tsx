"use client";

import { Star } from "lucide-react";
import { useSyncExternalStore } from "react";

/** Activity older than this isn't shown: a stale date says less than no date. */
const FRESH_DAYS = 60;

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function relative(iso: string, now: number) {
  const seconds = (new Date(iso).getTime() - now) / 1000;
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(timer);
}

/** The current time, rounded to the minute; null while server rendering, so markup always matches. */
export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => null,
  );
}

const isFresh = (iso: string, now: number) => now - new Date(iso).getTime() < FRESH_DAYS * 86400_000;

/** "● updated 2 days ago · ★ 3" for a project card. Renders nothing when there's nothing worth showing. */
export function RepoBadge({ pushedAt, stars }: { pushedAt: string; stars: number }) {
  const now = useNow();
  const fresh = now !== null && isFresh(pushedAt, now);
  if (!fresh && stars === 0) return null;

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
      {fresh && (
        <span className="inline-flex items-center gap-2">
          <span className="live-dot" aria-hidden="true" />
          updated <time dateTime={pushedAt}>{relative(pushedAt, now)}</time>
        </span>
      )}
      {stars > 0 && (
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" aria-hidden="true" />
          {stars}
          <span className="sr-only"> {stars === 1 ? "star" : "stars"} on GitHub</span>
        </span>
      )}
    </p>
  );
}

/** "● Latest push 3 hours ago · repo-name", linking to the repo. Hidden when the latest push is stale. */
export function LatestPush({ name, url, pushedAt }: { name: string; url: string; pushedAt: string }) {
  const now = useNow();
  if (now === null || !isFresh(pushedAt, now)) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex max-w-full items-center gap-2.5 font-mono text-xs text-muted transition-colors hover:text-ink"
    >
      <span className="live-dot flex-none" aria-hidden="true" />
      <span className="truncate">
        Latest push <time dateTime={pushedAt}>{relative(pushedAt, now)}</time> ·{" "}
        <span className="text-ink group-hover:text-accent">{name}</span>
      </span>
      <span className="sr-only"> on GitHub (opens in a new tab)</span>
    </a>
  );
}
