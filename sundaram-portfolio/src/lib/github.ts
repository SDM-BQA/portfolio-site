import { cacheLife } from "next/cache";

export const GITHUB_USER = "SDM-BQA";

export type RepoActivity = { name: string; url: string; stars: number; pushedAt: string };
export type GitHubActivity = { repos: Record<string, RepoActivity>; latest: RepoActivity | null };

type ApiRepo = { name: string; html_url: string; stargazers_count: number; pushed_at: string; fork: boolean; archived: boolean };

/**
 * Public activity for the site's GitHub account, in one request: every repo's
 * stars and last push, plus the most recently pushed repo. Cached and refreshed
 * about once an hour, so visitors never call GitHub themselves.
 *
 * GITHUB_TOKEN is optional (a fine-grained token with no permissions is enough);
 * it only raises GitHub's rate limit. Without it the public limit applies.
 * Returns null if GitHub can't be reached, and callers then show nothing.
 */
export async function getGitHubActivity(): Promise<GitHubActivity | null> {
  "use cache";

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
    });
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`);

    const list = ((await response.json()) as ApiRepo[]).filter((repo) => !repo.fork && !repo.archived);
    const repos: Record<string, RepoActivity> = {};
    for (const repo of list) {
      // Keyed in lower case, so "CoreLog" and "corelog" both match.
      repos[repo.name.toLowerCase()] = {
        name: repo.name,
        url: repo.html_url,
        stars: repo.stargazers_count,
        pushedAt: repo.pushed_at,
      };
    }
    const latest = list.length ? repos[list[0].name.toLowerCase()] : null;

    cacheLife("hours");
    return { repos, latest };
  } catch {
    // Try again soon rather than hiding the activity for a whole hour.
    cacheLife("minutes");
    return null;
  }
}
