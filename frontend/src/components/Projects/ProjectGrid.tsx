// ProjectGrid.tsx

import type { Repo } from "./ProjectCard";
import ProjectSlide from "./ProjectSlide";
import "../../styles/project-grid.css";

type Props = {
  repos: Repo[];
};

export default function ProjectGrid({ repos }: Props) {
  return (
    <div className="project-grid">
      {repos.map((repo) => (
        <ProjectSlide repo={repo} />
      ))}
    </div>
  );
}
