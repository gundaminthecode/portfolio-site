// Projects.tsx

import { useGithubRepos } from "../hooks/useGithubRepos";
// import type { Repo } from "../components/Projects/ProjectCard";
import ProjectGrid from "../components/Projects/ProjectGrid";
import ProjectFilters, {
  // type FiltersState,
  DEFAULT_FILTERS,
  applyFiltersAndSort,
  uniqueLanguages,
} from "../components/Projects/ProjectFilters";

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
  const { repos, loading, error } = useGithubRepos({
    username,
    includeForks,
    includeArchived,
    sortBy,
  });

  const languages = uniqueLanguages(repos);
  const filtered = applyFiltersAndSort(repos, DEFAULT_FILTERS);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;

  return (
    <div>
      <div id="upper-content">
        <section id="projects" className="projects-section">
          {/* Desktop: sticky sidebar */}
          <aside className="filter-panel filter-panel--desktop app-divs">
            <aside className="projects-filters">
              <ProjectFilters
                languages={languages}
                value={DEFAULT_FILTERS}
                onChange={() => {}}
                onReset={() => {}}
              />
            </aside>
          </aside>

          <div className="project-grid-wrapper app-divs">
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
                    value={DEFAULT_FILTERS}
                    onChange={() => {}}
                    onReset={() => {}}
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
