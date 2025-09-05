// Projects.tsx

import { useEffect, useMemo, useState } from "react";
import type { Repo } from "../components/Projects/ProjectCard";
import ProjectGrid from "../components/Projects/ProjectGrid";
import ProjectFilters, {
  type FiltersState,
  DEFAULT_FILTERS,
  applyFiltersAndSort,
  uniqueLanguages,
} from "../components/Projects/ProjectFilters";

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

type Props = {
  username: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  max?: number;
  sortBy?: "updated" | "stars";
};

export default function Projects({
  username,
  includeForks = false,
  includeArchived = false,
  sortBy = "updated",
  }: Props) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [error, setError] = useState<string | null>(null);


    useEffect(() => {
      setLoading(true);
      setError(null);
  
      const url = `${API_BASE}/api/repos?username=${encodeURIComponent(username)}&includeForks=${includeForks}&includeArchived=${includeArchived}&sortBy=${sortBy}`;
      fetch(url)
        .then(r => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`))
        .then((data: Repo[]) => setRepos(data))
        .catch((e) => setError(String(e)))
        .finally(() => setLoading(false));
  
      return () => { };
    }, [username, includeForks, includeArchived, sortBy]);

  const languages = useMemo(() => uniqueLanguages(repos), [repos]);
  const filtered = useMemo(() => applyFiltersAndSort(repos, filters), [repos, filters]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;

  return (
    <section id="projects" className="projects-section">
        
        <aside className="filter-panel">
            <aside className="projects-filters">
            <ProjectFilters
                languages={languages}
                value={filters}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
            />
            </aside>
        </aside>

        <div className="project-grid-wrapper">
            <div className="projects-content">
                <h2>Projects</h2>
                <p className="hud">All public repositories for @gundaminthecode</p>
                <ProjectGrid repos={filtered} />
            </div>
        </div>
    </section>
  );
}
