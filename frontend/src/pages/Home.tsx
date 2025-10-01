// src/pages/Home.tsx
import GithubProjects from "../components/Projects/GithubProjects";
import "../styles/Home.css";
import { NavLink} from "react-router-dom";


import { CONFIG } from "../config";
import DiagonalHexBackground from "../components/Background/DiagonalHexBackground";
import useScrollReveal from "../hooks/useScrollReveal";

const username = CONFIG.GITHUB_USERNAME;

export default function Home() {
  useScrollReveal();

  return (
    <>
    <div id="content-stack">
      <div className="content-slice" id="headshot-slice">
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
            <button><NavLink to="/portfolio-project">View Project Breakdown</NavLink></button>
          </div>
        </div>
        
      </div>
    </div>
    </>
  );
}
