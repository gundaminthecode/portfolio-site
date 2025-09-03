// src/pages/Projects.tsx
import { useEffect, useState } from "react";
import type { Repo } from "../components/Projects/ProjectCard";
import ProjectGrid from "../components/Projects/ProjectGrid";

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/repos?username=gundaminthecode&includeForks=false&includeArchived=false&sortBy=updated`)
      .then((res) => res.json())
      .then((data: Repo[]) => setRepos(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <section id="projects">
      <div>
        <div>Projects</div>
        <p>All public repositories for @gundaminthecode</p>
        <ProjectGrid repos={repos} />
      </div>
    </section>
  );
}

