// Projects.tsx

import { useGithubRepos } from "../hooks/useGithubRepos";
import ProjectGrid from "../components/Projects/ProjectGrid";
import ProjectFilters, {
  DEFAULT_FILTERS,
  applyFiltersAndSort,
  uniqueLanguages,
} from "../components/Projects/ProjectFilters";

import DiagonalHexBackground from "../components/Background/DiagonalHexBackground";
import "../styles/projects.css";

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
    <>
      <div id="content-stack">
        <div className="content-slice" id="projects-hero-slice">
          <DiagonalHexBackground route="BR_TL" zIndex={-1} />
          <div className="slice-content">Hi there! Here are some of my projects:</div>
        </div>

        <div className="content-slice" id="projects-grid-slice">
          <DiagonalHexBackground route="BR_TL" zIndex={-1} />
          <div className="slice-content">
            <div id="desktop-filters-container">
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
            </div>

            <div className="projects-grid-container">
              <div className="project-grid-wrapper app-divs">
                <h2>Projects</h2>
                <p className="hud">All public repositories for @{username}</p>
                <ProjectGrid repos={filtered} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
