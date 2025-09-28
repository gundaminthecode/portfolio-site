// src/pages/Home.tsx
import GithubProjects from "../components/Projects/GithubProjects";


import { CONFIG } from "../config";

const username = CONFIG.GITHUB_USERNAME;

export default function Home() {

  return (
    <>
      <div id="upper-content">
        <div id="app-sidebar" className="app-divs">
          <p>Welcome to my portfolio site! Explore my projects and learn more about me.</p>
        </div>
        <div id="app-main-content" className="app-divs">
          <section id="projects" className="vh-section">
            <div className="content">
              <GithubProjects
                username={username}
                includeForks={false}
                includeArchived={false}
                sortBy="updated"
                max={4}
              />
            </div>
          </section>
          <section id="about">
            <div>
              <div>About Me</div>
              <p>This is a brief introduction about myself.</p>
            </div>
          </section>
        </div>
      </div>
      <div id="lower-content">
        <div className="app-divs">
          <div>Contact</div>
          <p>
            You can reach me via email at{" "}
            <a href="mailto:nmath2211@outlook.com">nmath2211@outlook.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
