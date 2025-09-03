// GithubProjects.tsx

import { useEffect, useMemo, useState } from "react";
import { type Repo } from "./ProjectCard.tsx";
import ProjectCarouselInfinite from "./ProjectCarouselInfinite";


// const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000"; // e.g. http://localhost:8000

type Props = {
  username: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  max?: number;
  sortBy?: "updated" | "stars";
};

export default function GithubProjects({
  username,
  includeForks = false,
  includeArchived = false,
  max,
  sortBy = "updated",
}: Props) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = `/api/repos?username=${encodeURIComponent(username)}&includeForks=${includeForks}&includeArchived=${includeArchived}&sortBy=${sortBy}`;
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`))
      .then((data: Repo[]) => setRepos(data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));

    return () => { };
  }, [username, includeForks, includeArchived, sortBy]);

  const filtered = useMemo(() => {
    let list = repos; // server already filtered & sorted, but keep client options
    return typeof max === "number" ? list.slice(0, max) : list;
  }, [repos, max]);

  if (loading) return <p>Loading repositories…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;
  if (filtered.length === 0) return <p>No repositories to display.</p>;

  return (
    <div id="projects" className="content">
      <h2>My Projects</h2>
      <p>Public GitHub repositories for @{username}</p>
      
      <ProjectCarouselInfinite repos={repos} autoplayMs={4000} startIndex={0} />
    </div>
  );
}
