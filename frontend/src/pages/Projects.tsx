// src/pages/Projects.tsx
import GithubProjects from "../components/Projects/GithubProjects";

export default function Projects() {
  return (
    <section id="projects">
      <div className="panel--fx">
        <div className="tape tape--cyan">Projects</div>
        <div className="chevrons" />
        <p className="hud">All public repositories for @gundaminthecode</p>

        <GithubProjects
          username="gundaminthecode"
          includeForks={false}
          includeArchived={false}
          sortBy="updated"   // or "stars"
          // max={24}
        />
      </div>
    </section>
  );
}
