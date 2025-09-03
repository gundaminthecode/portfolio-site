import { useEffect, useMemo, useState } from "react";
import type { Repo } from "../components/Projects/ProjectCard";
import ProjectGrid from "../components/Projects/ProjectGrid";
import ProjectFilters, {
  type FiltersState,
  DEFAULT_FILTERS,
  applyFiltersAndSort,
  uniqueLanguages,
} from "../components/Projects/ProjectFilters";

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/repos?username=gundaminthecode&includeForks=false&includeArchived=false&sortBy=updated`)
      .then((res) => res.json())
      .then((data: Repo[]) => setRepos(data))
      .finally(() => setLoading(false));
  }, []);

  const languages = useMemo(() => uniqueLanguages(repos), [repos]);
  const filtered = useMemo(() => applyFiltersAndSort(repos, filters), [repos, filters]);

  if (loading) return <p>Loading…</p>;

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
