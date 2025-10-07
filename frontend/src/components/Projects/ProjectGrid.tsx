// components/Projects/ProjectGrid.tsx

// Grid layout for displaying GitHub repositories as project cards

import ProjectSlide from "./ProjectSlide";
import type { Repo } from "./ProjectCard";
import "../../styles/project-grid.css";
import "../../styles/project-cards.css";

export default function ProjectGrid({ repos }: { repos: Repo[] }) {
  const keyOf = (r: Repo) =>
    (r as any).id ?? (r as any).full_name ?? (r as any).name ?? (r as any).html_url;

  return (
    <div className="projects-grid">
      {/* Render project slides */}
      {repos.map((repo) => (
        <ProjectSlide key={keyOf(repo)} repo={repo} variant="grid" />
      ))}
    </div>
  );
}
