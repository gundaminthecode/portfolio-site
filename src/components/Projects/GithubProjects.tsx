import { useEffect, useMemo, useState } from "react";
import ProjectCard, { type Repo } from "./ProjectCard.tsx";

// Simple cache to avoid rate limits while developing
const CACHE_KEY = "gh_repos_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Get the GitHub token from environment variables
type Props = {
    username: string;              // "gundaminthecode"
    includeForks?: boolean;        // default false
    includeArchived?: boolean;     // default false
    max?: number;                  // optional cap
    sortBy?: "updated" | "stars";  // default "updated"
};

export default function GithubProjects({
    username,
    includeForks = false,
    includeArchived = false,
    max,
    sortBy = "updated",
}: Props) { // default sort by last updated
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined; 

    useEffect(() => {
        let cancelled = false;

        async function load() {
        setLoading(true);
        setError(null);

        // Try loading from cache first
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
            try {
            // Parse cached data
            const cached = JSON.parse(raw) as { ts: number; data: Repo[] };
            if (Date.now() - cached.ts < CACHE_TTL_MS) {
                setRepos(cached.data);
                setLoading(false);
                return;
            }
            } catch {}
        }
        // If cache is empty or expired, fetch from GitHub API
        try {
            const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;
            const res = await fetch(url, {
            // Include token if available
            headers: {
                Accept: "application/vnd.github+json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "X-GitHub-Api-Version": "2022-11-28",
            },
            });

            // Check if the response is ok
            // If not, throw an error to be caught below
            if (!res.ok) {
            const msg = `${res.status} ${res.statusText}`;
            throw new Error(`GitHub API error: ${msg}`);
            }

            const data = (await res.json()) as Repo[]; // Type assertion

            // If Cancelled, do not update state
            if (!cancelled) {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
            setRepos(data);
            }
        } catch (e: any) {
            if (!cancelled) setError(e.message || "Failed to load repositories"); // Set error state
        } finally {
            if (!cancelled) setLoading(false); // Set loading to false regardless of success or failure
        }
        }

        load(); // Call the load function to fetch data
        return () => { cancelled = true; };
    }, [username, token]);

    // Filter and sort repositories based on props
    // Use useMemo to optimize performance
    const filtered = useMemo(() => {
        let list = repos.filter(r => (includeForks || !r.fork) && (includeArchived || !r.archived));
        if (sortBy === "stars") {
        list = list.sort((a, b) => b.stargazers_count - a.stargazers_count);
        } else {
        list = list.sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
        }
        return typeof max === "number" ? list.slice(0, max) : list;
    }, [repos, includeForks, includeArchived, max, sortBy]);

    // Render the component
    // Show loading, error, or the list of repositories
    if (loading) return <p>Loading repositories…</p>;
    if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;
    if (filtered.length === 0) return <p>No repositories to display.</p>;

    return (
        <section id="projects">
        <h2>My Projects</h2>
        <p>Public GitHub repositories for @{username}</p>
        <div className="project-grid">
            {filtered.map(repo => (
            <ProjectCard key={repo.id} repo={repo} />
            ))}
        </div>
        </section>
    );
}
