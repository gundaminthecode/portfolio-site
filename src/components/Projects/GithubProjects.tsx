import { useEffect, useMemo, useState } from "react";
import ProjectCard, { type Repo } from "./ProjectCard.tsx";

type Props = {
  username: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  max?: number;
  sortBy?: "updated" | "stars";
  useServerless?: boolean; // set true once your /api is live
};

export default function GithubProjects({
  username,
  includeForks = false,
  includeArchived = false,
  max,
  sortBy = "updated",
  useServerless = false,
}: Props) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only used when fetching directly from GitHub (dev). Avoid in prod.
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
  const CACHE_KEY = `gh_repos_cache_v1:${username}`;
  const CACHE_TTL_MS = 10 * 60 * 1000;

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      // cache first
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached = JSON.parse(raw) as { ts: number; data: Repo[] };
          if (Date.now() - cached.ts < CACHE_TTL_MS) {
            setRepos(cached.data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore cache parse errors
      }

      try {
        // 👉 flip this base URL once your serverless function is deployed
        const url = useServerless
          ? `/api/repos?user=${encodeURIComponent(username)}`
          : `https://api.github.com/users/${encodeURIComponent(
              username
            )}/repos?per_page=100&sort=updated`;

        const res = await fetch(url, {
          signal: controller.signal,
          headers: useServerless
            ? { Accept: "application/json" }
            : {
                Accept: "application/vnd.github+json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "X-GitHub-Api-Version": "2022-11-28",
              },
        });

        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }

        const data = (await res.json()) as Repo[];
        if (!cancelled) {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ ts: Date.now(), data })
          );
          setRepos(data);
        }
      } catch (e: any) {
        if (!cancelled && e?.name !== "AbortError") {
          setError(e.message || "Failed to load repositories");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
    // token is intentionally NOT a dependency to avoid reloading when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, useServerless]);

  const filtered = useMemo(() => {
    const list = repos.filter(
      (r) => (includeForks || !r.fork) && (includeArchived || !r.archived)
    );

    const sorted =
      sortBy === "stars"
        ? [...list].sort((a, b) => b.stargazers_count - a.stargazers_count)
        : [...list].sort(
            (a, b) =>
              +new Date(b.updated_at) - +new Date(a.updated_at)
          );

    return typeof max === "number" ? sorted.slice(0, max) : sorted;
  }, [repos, includeForks, includeArchived, max, sortBy]);

  if (loading) return <p>Loading repositories…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;
  if (filtered.length === 0) return <p>No repositories to display.</p>;

  return (
    <section id="projects">
      <h2>My Projects</h2>
      <p>Public GitHub repositories for @{username}</p>
      <div className="project-grid">
        {filtered.map((repo) => (
          <ProjectCard key={repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}
