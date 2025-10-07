// pages/Projects.tsx

// This component displays a list of GitHub projects with filtering options and user profile information.

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
import { useGithubUser } from "../hooks/useGithubUser";


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
  const { user, loading: userLoading, error: userError } = useGithubUser(username);

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
          <div className="slice-content">
            {user ? (
              <section className="github-profile-panel app-divs">
                <img className="gh-avatar" src={user.avatar_url} alt={`${user.name ?? user.login} avatar`} />
                <div className="gh-main">
                  <h1 className="gh-name">
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                      {user.name ?? user.login} - Nick Mathiasen
                    </a>
                  </h1>
                  {user.bio && <p className="gh-bio">{user.bio}</p>}
                  <ul className="gh-meta">
                    {user.location && <li>📍 {user.location}</li>}
                    {user.company && <li>🏢 {user.company}</li>}
                    <li>👥 {user.followers} followers · {user.following} following</li>
                    <li>📦 {user.public_repos} public repos</li>
                  </ul>
                  <div className="gh-actions">
                    <a className="btn" href={user.html_url} target="_blank" rel="noopener noreferrer">GitHub</a>
                    {user.blog && user.blog.trim() && (
                      <a className="btn btn--ghost" href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer">
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </section>
            ) : userLoading ? (
              <p>Loading profile…</p>
            ) : userError ? (
              <p style={{ color: "crimson" }}>Profile error: {userError}</p>
            ) : null}
          </div>
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
