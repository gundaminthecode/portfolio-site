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

    const url = `${API_BASE}/api/repos?username=${encodeURIComponent(
      username
    )}&includeForks=${includeForks}&includeArchived=${includeArchived}&sortBy=${sortBy}`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)))
      .then((data: Repo[]) => setRepos(data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [username, includeForks, includeArchived, sortBy]);

  const languages = useMemo(() => uniqueLanguages(repos), [repos]);
  const filtered = useMemo(() => applyFiltersAndSort(repos, filters), [repos, filters]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;

  return (
    <div>
      <div id="upper-content">
        <section id="projects" className="projects-section">
          {/* Desktop: sticky sidebar */}
          <aside className="filter-panel filter-panel--desktop">
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
              <p className="hud">All public repositories for @{username}</p>

              {/* Mobile: collapsible dropdown */}
              <details className="filters-mobile filter-panel--mobile">
                <summary className="filters-mobile__summary">
                  <span>Filters</span>
                  <svg
                    aria-hidden
                    className="chev"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </summary>
                <div className="filters-mobile__content">
                  <ProjectFilters
                    languages={languages}
                    value={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(DEFAULT_FILTERS)}
                  />
                </div>
              </details>

              <ProjectGrid repos={filtered} />
            </div>
          </div>
        </section>
      </div>
    </div>  
  );
}
