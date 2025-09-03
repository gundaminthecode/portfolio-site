// src/pages/Home.tsx
import GithubProjects from "../components/Projects/GithubProjects";

export default function Home() {
  return (
    <>
      {/* Projects teaser on Home */}
      <section id="projects">
        <div className="panel--fx">
          <div className="tape tape--cyan">My Projects</div>
          <div className="chevrons" />
          <p className="hud">Public GitHub repositories for @gundaminthecode</p>

          {/* show a few here or a carousel; full list is on Projects page */}
          <GithubProjects
            username="gundaminthecode"
            includeForks={false}
            includeArchived={false}
            sortBy="updated"
            max={5} 
          />
        </div>
      </section>

      <section id="about">
        <div className="panel--fx">
          <div className="tape tape--orange">About Me</div>
          <div className="chevrons" />
          <p>This is a brief introduction about myself.</p>
        </div>
      </section>

      <section id="contact">
        <div className="panel--fx">
          <div className="tape tape--orange">Contact</div>
          <div className="chevrons" />
          <p>
            You can reach me via email at{" "}
            <a href="mailto:nmath2211@outlook.com">nmath2211@outlook.com</a>
          </p>
        </div>
      </section>
    </>
  );
}
