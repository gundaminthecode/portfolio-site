// Projects.tsx

import { useGithubRepos } from "../hooks/useGithubRepos";
import ProjectGrid from "../components/Projects/ProjectGrid";
import ProjectFilters, {
  DEFAULT_FILTERS,
  applyFiltersAndSort,
  uniqueLanguages,
} from "../components/Projects/ProjectFilters";
import { useState } from "react";
import DiagonalHexBackground from "../components/Background/DiagonalHexBackground";
import "../styles/projects.css";
import { Link } from 'react-router-dom';


type Props = {
  username: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  max?: number;
  sortBy?: "updated" | "stars";
};

export default function Projects(props: Props) {

  const {
    username,
    includeForks = false,
    includeArchived = false,
    sortBy = "updated",
  } = props;

  const { repos, loading, error } = useGithubRepos({
    username,
    includeForks,
    includeArchived,
    sortBy,
  });

  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const languages = uniqueLanguages(repos);

  const filtered = applyFiltersAndSort(repos, filters);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;

  return (
    <>
      <div id="content-stack">
        <Link to="/" className='back-link'>Back</Link>
        <div className="content-slice" id="projects-hero-slice">
          <DiagonalHexBackground route="BR_TL" zIndex={-1} />
          <div className="slice-content">Hi there! Here are some of my projects:</div>
        </div>

        <div className="content-slice" id="projects-grid-slice">
          <DiagonalHexBackground route="BR_TL" zIndex={-1} />
          <div className="slice-content">
            <aside
              id="projects-filters"
              className="projects-filters filter-panel filter-panel--desktop app-divs"
            >
              <ProjectFilters
                languages={languages}
                value={filters}
                onChange={setFilters}
                onReset={() => setFilters({ ...DEFAULT_FILTERS })}
              />
            </aside>

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
