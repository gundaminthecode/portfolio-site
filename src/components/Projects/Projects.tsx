import { useState } from "react";

export default function Projects() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const projects = ["Project 1", "Project 2", "Project 3"];

  return (
    <section id="projects">
      <h2>My Projects</h2>
      <p>Here are some of the projects I've worked on.</p>

      <div className="project-list">
        {projects.map((project) => (
          <div
            key={project}
            className="project-card"
            onClick={() => setActiveProject(project)}
          >
            {project}
          </div>
        ))}
      </div>

      {activeProject && (
        <div className="popup">
          <div className="popup-content">
            <h3>{activeProject}</h3>
            <p>Project details go here.</p>
            <button onClick={() => setActiveProject(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
