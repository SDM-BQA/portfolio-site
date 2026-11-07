import { Activity, ArrowUpRight, BookMarked, Flame, Trophy, Users } from "lucide-react";
import type { ComponentType } from "react";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { CountUp } from "@/components/ui/CountUp";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  GITHUB_URL,
  GITHUB_USER,
  getContributions,
  getGitHubActivity,
  getGitHubProfile,
  getRecentCommits,
  type ContributionDay,
  type RepoActivity,
} from "@/lib/github";
import { GitHubPanel, type LogCommit } from "./GitHubPanel";

/** How many of the most recently pushed repos feed the commit log. */
const LOG_REPOS = 6;

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#E5C300",
  TypeScript: "#3178C6",
  HTML: "#E34F26",
  CSS: "#8C5CC7",
  Java: "#E76F00",
  C: "#5C8DBC",
  Python: "#3572A5",
};

/** Current streak ends today, or yesterday if today has no contributions yet. */
function streaks(days: ContributionDay[]) {
  let longest = 0;
  let run = 0;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  let index = days.length - 1;
  if (index >= 0 && days[index].count === 0) index -= 1;
  for (; index >= 0 && days[index].count > 0; index -= 1) current += 1;
  return { current, longest };
}

/** Share of repos by primary language; small ones are grouped as "Other". */
function languages(repos: RepoActivity[]) {
  const counts = new Map<string, number>();
  for (const repo of repos) if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  const total = [...counts.values()].reduce((sum, value) => sum + value, 0);
  if (!total) return [];
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5);
  const other = sorted.slice(5).reduce((sum, [, value]) => sum + value, 0);
  return [...top, ...(other ? [["Other", other] as [string, number]] : [])].map(([name, value]) => ({
    name,
    percent: Math.round((value / total) * 100),
    color: LANGUAGE_COLORS[name] ?? "var(--muted)",
  }));
}

/** The commit's calendar day in IST, to match it to a day on the graph. */
const dayIn = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

function Badge({ Icon, label, children }: { Icon: ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <li className="gh-badge card spotlight p-4 md:p-5">
      <p className="flex items-center gap-2 font-mono text-xs text-muted">
        <Icon className="size-4 text-accent" aria-hidden="true" />
        {label}
      </p>
      <p className="font-display mt-2 text-3xl font-bold tracking-tight tabular-nums md:text-4xl">{children}</p>
    </li>
  );
}

export async function GitHubSection() {
  const [activity, profile, contributions] = await Promise.all([getGitHubActivity(), getGitHubProfile(), getContributions()]);
  const commits = activity ? await getRecentCommits(activity.recent.slice(0, LOG_REPOS).map((repo) => repo.name)) : null;

  // With nothing from GitHub, the section stays out of the page entirely.
  if (!activity && !profile && !contributions) return null;

  const streak = contributions ? streaks(contributions.days) : null;
  const stars = activity ? activity.recent.reduce((sum, repo) => sum + repo.stars, 0) : 0;
  const langs = activity ? languages(activity.recent) : [];
  const log: LogCommit[] = (commits ?? []).map((commit) => ({ ...commit, day: dayIn(commit.date) }));

  return (
    <section id="github" aria-labelledby="github-heading" className="py-16 md:py-24">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="github-heading" label="Open source" title="Shipping in public" />
          <Reveal>
            <ExternalLink href={GITHUB_URL} className="btn btn-ghost">
              <GitHubIcon className="size-4" />
              @{GITHUB_USER}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </ExternalLink>
          </Reveal>
        </div>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          Live from GitHub and refreshed every hour. Pick a day on the graph to see what I committed.
        </p>

        <Reveal className="mt-8">
          {/* On phones the odd last badge spans the row instead of sitting alone. */}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 max-sm:[&>li:last-child:nth-child(odd)]:col-span-2">
            {contributions && (
              <Badge Icon={Activity} label="Contributions · 1 yr">
                <CountUp value={contributions.total} decimals={0} />
              </Badge>
            )}
            {streak && (
              <Badge Icon={Flame} label="Current streak">
                {streak.current}
                <span className="ml-1 text-base font-medium text-muted">{streak.current === 1 ? "day" : "days"}</span>
              </Badge>
            )}
            {streak && (
              <Badge Icon={Trophy} label="Longest streak">
                {streak.longest}
                <span className="ml-1 text-base font-medium text-muted">days</span>
              </Badge>
            )}
            {profile && (
              <Badge Icon={BookMarked} label={stars > 0 ? `Public repos · ★ ${stars}` : "Public repos"}>
                <CountUp value={profile.publicRepos} decimals={0} />
              </Badge>
            )}
            {profile && (
              <Badge Icon={Users} label="Followers">
                <CountUp value={profile.followers} decimals={0} />
              </Badge>
            )}
          </ul>
        </Reveal>

        <Reveal className="mt-5">
          <GitHubPanel
            user={GITHUB_USER}
            total={contributions?.total ?? null}
            days={contributions?.days ?? null}
            commits={log}
            aside={
              langs.length > 0 && (
                <div className="card p-5">
                  <p className="eyebrow uppercase">Languages · by repo</p>
                  <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-elevated" aria-hidden="true">
                    {langs.map((lang) => (
                      <span key={lang.name} className="h-full" style={{ width: `${lang.percent}%`, background: lang.color }} />
                    ))}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {langs.map((lang) => (
                      <li key={lang.name} className="flex items-center gap-2.5">
                        <span className="size-2.5 flex-none rounded-full" style={{ background: lang.color }} aria-hidden="true" />
                        <span className="flex-1">{lang.name}</span>
                        <span className="font-mono text-xs text-muted tabular-nums">{lang.percent}%</span>
                      </li>
                    ))}
                  </ul>
                  {profile && (
                    <p className="mt-5 border-t border-dashed border-line pt-4 font-mono text-xs text-muted">
                      On GitHub since {new Date(profile.joined).getFullYear()}
                    </p>
                  )}
                </div>
              )
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
