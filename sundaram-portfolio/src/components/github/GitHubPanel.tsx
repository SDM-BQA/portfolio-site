"use client";

import { GitCommitHorizontal, X } from "lucide-react";
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { relative, useNow } from "@/components/ui/RecentActivity";
import type { Commit, ContributionDay } from "@/lib/github";

export type LogCommit = Commit & { day: string };

const LOG_SIZE = 8;
const LOG_MAX = 30;
const WEEKDAY_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

/** Dates are formatted in UTC from their YYYY-MM-DD form, so server and browser always agree. */
const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const monthName = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const asDate = (day: string) => new Date(`${day}T00:00:00Z`);

const describe = (day: ContributionDay) =>
  `${day.count === 0 ? "No" : day.count.toLocaleString("en-US")} contribution${day.count === 1 ? "" : "s"} on ${longDate.format(asDate(day.date))}`;

function Heatmap({
  days,
  total,
  selected,
  onSelect,
}: {
  days: ContributionDay[];
  total: number;
  selected: string | null;
  onSelect: (date: string | null) => void;
}) {
  const [hovered, setHovered] = useState<ContributionDay | null>(null);
  const [focusIndex, setFocusIndex] = useState(days.length - 1);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);

  // A month label sits over the week holding that month's first Sunday.
  const months = useMemo(() => {
    const labels: { week: number; label: string }[] = [];
    const lastWeek = days[days.length - 1]?.week ?? 0;
    for (const day of days) {
      // Skip the final two weeks: a label there would be cut off at the edge.
      if (day.weekday !== 0 || Number(day.date.slice(8)) > 7 || day.week > lastWeek - 2) continue;
      if (labels.length && day.week - labels[labels.length - 1].week < 3) continue;
      labels.push({ week: day.week, label: monthName.format(asDate(day.date)) });
    }
    return labels;
  }, [days]);

  const selectedDay = selected ? days.find((day) => day.date === selected) : undefined;
  const status = hovered ?? selectedDay;

  // Arrow keys move one day (up/down) or one week (left/right), like GitHub's own graph.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = Math.min(days.length - 1, Math.max(0, focusIndex + step));
    setFocusIndex(next);
    cells.current[next]?.focus();
  }

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow uppercase">Contributions</p>
        <p className="font-mono text-xs text-muted" aria-live="polite">
          {status ? describe(status) : `${total.toLocaleString("en-US")} contributions in the last year`}
        </p>
      </div>

      {/* rtl keeps the scroll position at the newest weeks on narrow screens; the content itself is ltr. */}
      <div dir="rtl" className="gh-scroll mt-4 overflow-x-auto pb-2">
        <div dir="ltr" className="inline-grid min-w-full grid-cols-[auto_1fr] gap-x-2">
          <span />
          <div className="gh-months" aria-hidden="true">
            {months.map((month) => (
              <span key={month.week} style={{ gridColumnStart: month.week + 1 }}>
                {month.label}
              </span>
            ))}
          </div>

          <div className="gh-weekdays" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6].map((weekday) => (
              <span key={weekday}>{WEEKDAY_LABELS[weekday] ?? ""}</span>
            ))}
          </div>
          <div
            role="group"
            aria-label="Contribution graph. Use arrow keys to move between days and Enter to show that day's commits."
            className="gh-grid"
            onKeyDown={onKeyDown}
            onPointerLeave={() => setHovered(null)}
          >
            {days.map((day, index) => (
              <button
                key={day.date}
                ref={(element) => {
                  cells.current[index] = element;
                }}
                type="button"
                tabIndex={index === focusIndex ? 0 : -1}
                aria-label={describe(day)}
                aria-pressed={day.date === selected}
                onPointerEnter={() => setHovered(day)}
                onFocus={() => {
                  setFocusIndex(index);
                  setHovered(day);
                }}
                onBlur={() => setHovered(null)}
                onClick={() => onSelect(day.date === selected ? null : day.date)}
                className={`gh-cell gh-l${day.level}`}
                style={{ gridColumnStart: day.week + 1, gridRowStart: day.weekday + 1 }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
        <span>Click a day to filter the commit log</span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={`gh-cell gh-l${level}`} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}

function CommitLog({
  user,
  commits,
  selected,
  onClear,
}: {
  user: string;
  commits: LogCommit[];
  selected: string | null;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const now = useNow();

  const filtered = selected ? commits.filter((commit) => commit.day === selected) : commits;
  const visible = filtered.slice(0, expanded || selected ? LOG_MAX : LOG_SIZE);

  return (
    <div className="card flex min-w-0 flex-col overflow-hidden font-mono text-[0.8125rem]">
      <div className="flex items-center gap-1.5 border-b border-line bg-elevated px-4 py-2.5">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-error/70" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-(--warning)/70" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-success/70" />
        <p className="ml-3 min-w-0 flex-1 truncate text-xs text-muted">
          <span className="text-accent">$</span> git log --author={user}
          {selected && (
            <span className="text-ink">
              {" "}
              --since={selected} --until={selected}
            </span>
          )}
        </p>
        {selected && (
          <button type="button" onClick={onClear} className="icon-btn size-7" aria-label="Show all commits">
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div aria-live="polite" className="flex-1">
        {visible.length === 0 ? (
          <p className="px-4 py-8 text-center leading-relaxed text-muted">
            {selected
              ? `No commits in my latest repos on ${shortDate.format(asDate(selected))}. Contributions also count pull requests, issues and other repos.`
              : "The commit log isn't available right now."}
          </p>
        ) : (
          <ol className="divide-y divide-line">
            {visible.map((commit) => (
              <li key={`${commit.repo}-${commit.sha}`} className="term-entry">
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-3 px-4 py-2.5 transition-colors hover:bg-elevated"
                >
                  <span className="text-(--warning)">{commit.sha}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-ink group-hover:text-accent">{commit.message}</span>
                    <span className="block truncate text-xs text-muted">{commit.repo}</span>
                  </span>
                  <time dateTime={commit.date} className="text-xs whitespace-nowrap text-muted">
                    {now === null ? shortDate.format(new Date(commit.date)) : relative(commit.date, now)}
                  </time>
                  <span className="sr-only"> (opens on GitHub in a new tab)</span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>

      {!selected && filtered.length > LOG_SIZE && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex items-center justify-center gap-2 border-t border-line py-2.5 text-xs text-muted transition-colors hover:bg-elevated hover:text-ink"
        >
          <GitCommitHorizontal className="size-3.5" aria-hidden="true" />
          {expanded ? "Show fewer" : `Show ${Math.min(filtered.length, LOG_MAX) - LOG_SIZE} more`}
        </button>
      )}
    </div>
  );
}

export function GitHubPanel({
  user,
  total,
  days,
  commits,
  aside,
}: {
  user: string;
  total: number | null;
  days: ContributionDay[] | null;
  commits: LogCommit[];
  aside?: ReactNode;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {days && total !== null && <Heatmap days={days} total={total} selected={selected} onSelect={setSelected} />}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <CommitLog user={user} commits={commits} selected={selected} onClear={() => setSelected(null)} />
        {aside}
      </div>
    </div>
  );
}
