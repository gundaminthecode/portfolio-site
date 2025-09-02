// ProjectSlide.tsx

import type { Repo } from "./ProjectCard";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

export default function ProjectSlide({ repo }: { repo: Repo }) {
  const live = (repo.live_url ?? repo.homepage ?? "").trim() || undefined;
  return (
    <div className="carousel__card" role="group" aria-label={repo.name}>
      <h3 style={{ margin: 0 }}>{repo.name}</h3>
      {repo.description && <p style={{ margin: 0 }}>{repo.description}</p>}
      <ul className="carousel__meta">
        {repo.language && <li>{repo.language}</li>}
        <li>★ {repo.stargazers_count}</li>
        <li>⑂ {repo.forks_count}</li>
        <li>Updated {formatDate(repo.updated_at)}</li>
      </ul>
      <div className="carousel__links">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" id="repo-button">View Repo</a>
        {live && <a href={live} target="_blank" rel="noopener noreferrer" id="site-button">Live Site</a>}
      </div>
    </div>
  );
}
