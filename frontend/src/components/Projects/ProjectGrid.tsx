import type { Repo } from "./ProjectCard";
import "../../styles/project-grid.css";

type Props = {
  repos: Repo[];
};

export default function ProjectGrid({ repos }: Props) {
  return (
    <div className="project-grid">
      {repos.map((repo) => (
        <article className="project-card" key={repo.id}>
          <h3>{repo.name}</h3>
          {repo.description && <p>{repo.description}</p>}
          <ul className="hud">
            {repo.language && <li>{repo.language}</li>}
            <li>★ {repo.stargazers_count}</li>
            <li>⑂ {repo.forks_count}</li>
          </ul>
          <div className="project-links">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              View Repo
            </a>
            {repo.homepage && repo.homepage.trim() !== "" && (
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                Live Site
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
