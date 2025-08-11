// import React from "react";

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

export default function ProjectCard({ repo }: { repo: Repo }) {
  const live = repo.homepage && repo.homepage.trim().length > 0 ? repo.homepage : undefined;

  return (
    <article className="project-card">
      <header className="project-card__header">
        <h3 className="project-card__title">{repo.name}</h3>
      </header>

      {repo.description && <p className="project-card__desc">{repo.description}</p>}

      <ul className="project-card__meta">
        {repo.language && <li>{repo.language}</li>}
        <li>★ {repo.stargazers_count}</li>
        <li>⑂ {repo.forks_count}</li>
        <li>Updated {formatDate(repo.updated_at)}</li>
      </ul>

      <div className="project-card__links">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">View Repo</a>
        {live && (
          <a href={live} target="_blank" rel="noopener noreferrer">Live Site</a>
        )}
      </div>
    </article>
  );
}