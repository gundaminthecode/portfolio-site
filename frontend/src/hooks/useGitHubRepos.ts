// useGithubRepos.ts
import { useEffect, useMemo, useState } from "react";
import type { Repo } from "../components/Projects/ProjectCard";

type Options = {
  username: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  sortBy?: "updated" | "pushed" | "full_name";
  apiBase?: string; // '' to use Vite proxy
};

export function useGithubRepos({
  username,
  includeForks = false,
  includeArchived = false,
  sortBy = "updated",
  apiBase = import.meta.env.VITE_API_BASE ?? "",
}: Options) {
  const [data, setData] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const url = useMemo(() => {
    const base = apiBase.replace(/\/$/, "");
    const qs = new URLSearchParams({
      username,
      includeForks: String(includeForks),
      includeArchived: String(includeArchived),
      sortBy,
    }).toString();
    return `${base}/api/repos?${qs}`;
  }, [apiBase, username, includeForks, includeArchived, sortBy]);

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        const text = await res.text();
        const ct = res.headers.get("content-type") || "";

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}\n${text.slice(0, 300)}`);
        }
        if (!ct.includes("application/json")) {
          throw new Error(`Expected JSON but got ${ct || "unknown"}`);
        }

        const json: Repo[] = JSON.parse(text);
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled && e.name !== "AbortError") {
          setError(e?.message ?? String(e));
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort(); // StrictMode will hit this once intentionally
    };
  }, [url]);

  return { data, loading, error };
}
