// ProjectSlide.tsx

import type { Repo } from "./ProjectCard";
import { Link } from "react-router-dom";

import "../../styles/project-grid.css";

type Props = {
  repo: Repo;
  variant?: "carousel" | "grid";
  className?: string;
};

export default function ProjectSlide({
  repo,
  variant = "carousel",
  className,
}: Props) {
  const updated =
    repo.updated_at?.length === 0
      ? ""
      : new Date(repo.updated_at).toLocaleDateString();

  return (
    <article
      className={`project-slide project-slide--${variant} ${className ?? ""}`.trim()}
      role="group"
      aria-label={repo.name}
    >
      <header className="project-slide__header">
        <h3 className="project-slide__title" style={{ margin: 0 }}>
          {repo.name}
        </h3>
      </header>
      
      {repo.language && (
        <span className="project-slide__lang">{repo.language}</span>
      )}
      
      {repo.description && (
        <p className="project-slide__desc" style={{ margin: 0 }}>
          {repo.description}
        </p>
      )}

      <div className="project-slide__meta">
        <span title="Stars">★ {repo.stargazers_count}</span><br />
        <span title="Forks">⑂ {repo.forks_count}</span><br />
        {updated && (
          <span title="Last updated" style={{ marginLeft: "auto" }}>
            ⏱ {updated}
          </span>
        )}
      </div>

      <footer className="project-slide__actions">
        <Link
          to={`/project/${repo.id}`}
          id="project-button"
        >
          View Project
        </Link>

        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          id="repo-button"
        >
          View Repository
        </a>
      </footer>
    </article>
  );
}
