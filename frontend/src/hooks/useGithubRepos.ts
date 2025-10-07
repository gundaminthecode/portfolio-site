// hooks/useGithubRepos.ts

// GitHub repositories viewer hook with filtering and sorting options

import { useEffect, useState } from "react";
import type { Repo } from "../components/Projects/ProjectCard";

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const DEFAULT_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "";

type Options = {
  username?: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  sortBy?: "updated" | "stars";
};

export function useGithubRepos({
  username = DEFAULT_USERNAME,
  includeForks = false,
  includeArchived = false,
  sortBy = "updated",
}: Options = {}) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch repositories from the API
    // API handles filtering and sorting
    const url = `${API_BASE}/api/repos?username=${encodeURIComponent(username)}&includeForks=${includeForks}&includeArchived=${includeArchived}&sortBy=${sortBy}`;
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`))
      .then((data: Repo[]) => setRepos(data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [username, includeForks, includeArchived, sortBy]);

  return { repos, loading, error };
}
