// src/pages/Home.tsx
import GithubProjects from "../components/Projects/GithubProjects";

import { CONFIG } from "../config";

const username = CONFIG.GITHUB_USERNAME;

export default function Home() {
  return (
    <>

      <div id="upper-content" >
          <div id="app-sidebar">
            <div className="app-divs">
              <p>Welcome to my portfolio site! Explore my projects and learn more about me.</p>
            </div>
            <div className="app-divs">

            </div>
          </div>
          <div id="app-main-content" className="app-divs">
            {/* Projects teaser on Home */}
            <section id="projects">
              <div className="content">
                  

                {/* show a few here or a carousel; full list is on Projects page */}
                <GithubProjects
                  username= { username }
                  includeForks={false}
                  includeArchived={false}
                  sortBy="updated"
                  max={5} 
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
          {/* Additional content can go here */}
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
