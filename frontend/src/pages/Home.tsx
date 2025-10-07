// src/pages/Home.tsx
import GithubProjects from "../components/Projects/GithubProjects";
import "../styles/Home.css";
import { NavLink} from "react-router-dom";


import { CONFIG } from "../config";
import DiagonalHexBackground from "../components/Background/DiagonalHexBackground";

const username = CONFIG.GITHUB_USERNAME;

export default function Home() {

  return (
    <>
    <div id="content-stack">
      <div className="" id="headshot-slice">
        <div id="headshot-circle">
          HI
        </div>
      </div>
      <div className="content-slice" id="intro-slice">
        <DiagonalHexBackground route="BR_TL" zIndex={-1} />
        <div className="slice-content">
          <div id="intro-text" className="align-center-col">
            <h1>Hi, I'm Nick</h1>
            <p>I'm an emerging developer specializing in web applications and interactive experiences. Welcome to my portfolio site!</p>
            <NavLink to="/about-me" className="home_link_button">Learn More About Me</NavLink>
          </div>
        </div>
      </div>
      <div className="content-slice" id="projects-slice">
        <DiagonalHexBackground route="BR_TL" zIndex={-1} />
        <div className="slice-content">
          <div id="project-previews">
            <GithubProjects
              username={username}
              includeForks={false}
              includeArchived={false}
              sortBy="updated"
              max={5}
            />
          </div>
          <div id="this-project">
            <h2>Want to learn more about this portfolio project?</h2>
            <NavLink to="/portfolio-project" className="home_link_button">View Project Breakdown</NavLink>
          </div>
        </div>
        
      </div>
    </div>
    </>
  );
}
