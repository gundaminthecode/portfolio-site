// hooks/useGithubUser.ts

// Hook to fetch GitHub user profile data by username

import { useEffect, useState } from "react";

export type GithubUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  blog: string | null;
  company: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
};

export function useGithubUser(username?: string) {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    // Fetch user profile from GitHub API
    fetch(`https://api.github.com/users/${username}`, {
      signal: ctrl.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return (await r.json()) as GithubUser;
      })
      .then(setUser)
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e));
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [username]);

  return { user, loading, error };
}