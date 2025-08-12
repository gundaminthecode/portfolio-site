// import React from "react";

// Export Repo type
export type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;      // not used now but fine to keep
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  live_url?: string | null;      // new from Flask API
};

// Format the date to a more readable format
// function formatDate(iso: string) {
//     return new Date(iso).toLocaleDateString();
// }

// Export the ProjectCard component
// ProjectCard.tsx
export default function ProjectCard({ repo }: { repo: Repo }) {
  const live = (repo.live_url ?? "").trim() || undefined;

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
        <li>Updated {new Date(repo.updated_at).toLocaleDateString()}</li>
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
