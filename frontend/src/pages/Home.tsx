// src/pages/Home.tsx
import GithubProjects from "../components/Projects/GithubProjects";

import { CONFIG } from "../config";

const username = CONFIG.GITHUB_USERNAME;

export default function Home() {
  return (
    <>
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
    </>
  );
}
