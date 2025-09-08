// ProjectSlide.tsx

import type { Repo } from "./ProjectCard";
import "../../styles/project-grid.css";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

export default function ProjectSlide({ repo }: { repo: Repo }) {
  const live = (repo.live_url ?? repo.homepage ?? "").trim() || undefined;
  return (
    <div className="project-card" role="group" aria-label={repo.name}>
      <h3 style={{ margin: 0 }}>{repo.name}</h3>
      {repo.description && <p style={{ margin: 0 }}>{repo.description}</p>}
      <ul className="project-meta">
        {repo.language && <li>{repo.language}</li>}
        <li>★ {repo.stargazers_count}</li>
        <li>⑂ {repo.forks_count}</li>
      </ul>
      <ul className="project-meta">
        <li>Updated: {formatDate(repo.updated_at)}</li>
        {repo.archived && <li>Archived</li>}
        {repo.fork && <li>Forked</li>}
      </ul>
      <div className="project-links ">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" id="repo-button">View Repo</a>
        {live && <a href={live} target="_blank" rel="noopener noreferrer" id="site-button">Live Site</a>}
      </div>
    </div>
  );
}
