import { cacheLife } from "next/cache";

/**
 * Live data from the site's public GitHub account. Every function here is cached
 * and refreshed about once an hour, so visitors never call GitHub themselves, and
 * each returns null when GitHub can't be reached so callers can simply hide.
 *
 * GITHUB_TOKEN is optional (a fine-grained token with no permissions is enough);
 * it only raises GitHub's API rate limit.
 */
export const GITHUB_USER = "SDM-BQA";
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;

const API = "https://api.github.com";

async function api<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!response.ok) throw new Error(`GitHub responded ${response.status} for ${path}`);
  return (await response.json()) as T;
}

/* ---------- Repos: project-card badges, the hero line and languages ---------- */

export type RepoActivity = { name: string; url: string; stars: number; pushedAt: string; language: string | null };
export type GitHubActivity = {
  repos: Record<string, RepoActivity>;
  /** Most recently pushed first. */
  recent: RepoActivity[];
  latest: RepoActivity | null;
};

type ApiRepo = {
  name: string;
  html_url: string;
  stargazers_count: number;
  pushed_at: string;
  language: string | null;
  fork: boolean;
  archived: boolean;
};

export async function getGitHubActivity(): Promise<GitHubActivity | null> {
  "use cache";
  try {
    const list = (await api<ApiRepo[]>(`/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`)).filter(
      (repo) => !repo.fork && !repo.archived,
    );
    const recent = list.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
      language: repo.language,
    }));
    // Keyed in lower case, so "CoreLog" and "corelog" both match.
    const repos = Object.fromEntries(recent.map((repo) => [repo.name.toLowerCase(), repo]));
    cacheLife("hours");
    return { repos, recent, latest: recent[0] ?? null };
  } catch {
    // Try again soon rather than hiding the activity for a whole hour.
    cacheLife("minutes");
    return null;
  }
}

/* ---------- Profile ---------- */

export type GitHubProfile = { publicRepos: number; followers: number; joined: string };

export async function getGitHubProfile(): Promise<GitHubProfile | null> {
  "use cache";
  try {
    const user = await api<{ public_repos: number; followers: number; created_at: string }>(`/users/${GITHUB_USER}`);
    cacheLife("hours");
    return { publicRepos: user.public_repos, followers: user.followers, joined: user.created_at };
  } catch {
    cacheLife("minutes");
    return null;
  }
}

/* ---------- Contribution calendar ---------- */

export type ContributionDay = { date: string; count: number; level: number; weekday: number; week: number };
export type Contributions = { total: number; days: ContributionDay[] };

/**
 * GitHub's GraphQL API needs a token for this, so it reads the public
 * contributions page instead: each day cell carries its date, level and position,
 * and its tooltip carries the count. If the markup ever changes, this returns null
 * and the graph is hidden rather than wrong.
 */
export async function getContributions(): Promise<Contributions | null> {
  "use cache";
  try {
    const response = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`);
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
    const html = await response.text();

    const counts = new Map<string, number>();
    for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      const match = text.match(/^(\d[\d,]*) contributions?/);
      counts.set(id, match ? Number(match[1].replace(/,/g, "")) : 0);
    }

    const days: ContributionDay[] = [];
    for (const [cell] of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
      const date = cell.match(/data-date="([^"]+)"/)?.[1];
      const id = cell.match(/\bid="(contribution-day-component-(\d+)-(\d+))"/);
      const level = cell.match(/data-level="(\d)"/)?.[1];
      if (!date || !id || level === undefined) continue;
      days.push({ date, count: counts.get(id[1]) ?? 0, level: Number(level), weekday: Number(id[2]), week: Number(id[3]) });
    }
    if (days.length < 300) throw new Error("Unexpected contributions markup");
    days.sort((a, b) => a.date.localeCompare(b.date));

    const totalText = html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1];
    const total = totalText ? Number(totalText.replace(/,/g, "")) : days.reduce((sum, day) => sum + day.count, 0);

    cacheLife("hours");
    return { total, days };
  } catch {
    cacheLife("minutes");
    return null;
  }
}

/* ---------- Commit log ---------- */

export type Commit = { sha: string; message: string; repo: string; url: string; date: string };

type ApiCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } | null };
  author: { login: string } | null;
};

/**
 * Real commits from the most recently pushed repos, newest first. (GitHub's
 * public events no longer include commit messages, so the log reads commits
 * directly.) Only the account's own commits are kept.
 */
export async function getRecentCommits(repoNames: string[], perRepo = 15): Promise<Commit[] | null> {
  "use cache";
  try {
    const lists = await Promise.all(
      repoNames.map(async (repo) => {
        const commits = await api<ApiCommit[]>(`/repos/${GITHUB_USER}/${repo}/commits?per_page=${perRepo}`).catch(() => []);
        return commits
          .filter((item) => !item.author || item.author.login.toLowerCase() === GITHUB_USER.toLowerCase())
          .map((item) => ({
            sha: item.sha.slice(0, 7),
            message: item.commit.message.split("\n")[0],
            repo,
            url: item.html_url,
            date: item.commit.author?.date ?? "",
          }));
      }),
    );
    const commits = lists
      .flat()
      .filter((commit) => commit.date)
      .sort((a, b) => b.date.localeCompare(a.date));
    cacheLife("hours");
    return commits;
  } catch {
    cacheLife("minutes");
    return null;
  }
}
