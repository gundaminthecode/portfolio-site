// App.tsx
// Main application component that sets up routing, layout, and global elements like header and footer.

import { NavLink, Outlet } from "react-router-dom";
import "./styles/App.css";
import { House, FolderGit2, User2, Linkedin, FlaskConical} from "lucide-react"; //Mail
import { SiGithub, SiInstagram } from "@icons-pack/react-simple-icons";
import { useEffect, useState } from "react";
import ContactModal from "./components/ContactModal";
import ScrollToTop from "./components/ScrollToTop";
import { CONFIG } from './config';
// import SeamlessSweep from "./components/Background/NewBackground";

// const navClass = ({ isActive }: { isActive: boolean }) =>
//   isActive ? "sidebar-nav__link is-active" : "sidebar-nav__link";

function App() {
  // const location = useLocation();
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const headerEl = document.querySelector("header");
    if (!headerEl) return;

    const setVar = () => {
      const h = Math.round(headerEl.getBoundingClientRect().height);
      root.style.setProperty("--header-h", `${h}px`);
    };

    const ro = new ResizeObserver(setVar);
    ro.observe(headerEl);

    setVar();
    window.addEventListener("resize", setVar);
    // account for webfont load changing header height
    (document as any).fonts?.ready?.then(setVar).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return (
    <div id="app-container">
      <ScrollToTop />
      {(() => {
        return (
          <div id="site-bg" aria-hidden="true">
            {/* <SeamlessSweep /> */}
          </div>
        );
      })()}

      <header>
        {/* <div id="logo-container">
          <a href="/" className="logo" aria-label="Home">NICK.DEV</a>
        </div>
        <div id="nav-container">
          <nav id="navBar" aria-label="Primary">
            <NavLink to="/" end className={navClass} aria-label="Home"><Home size={24} /></NavLink>
            <NavLink to="/projects" className={navClass} aria-label="Projects"><FolderGit2 size={24} /></NavLink>
            <NavLink to="/about-me" className={navClass} aria-label="About"><User2 size={24} /></NavLink>
            <button type="button" className="sidebar-nav__link" aria-label="Contact" onClick={() => setContactOpen(true)}>
              <Mail size={24} />
            </button>
          </nav>
        </div> */}
        <div id="nav-container-left">
          <nav id="navBar">
            <NavLink to="/" end className="navClass" aria-label="Home"><House/></NavLink>
            <NavLink to="/projects" className="navClass" aria-label="Projects"><FolderGit2/></NavLink>
          </nav>
        </div>
        <h1 id="hero-text">nickmathiasen<span className="dot">.</span>DEV</h1>
        <div id="nav-container-right">
          <nav id="navBar">
            <NavLink to="/about-me" className="navClass" aria-label="About"><User2/></NavLink>
            <NavLink to="/about-me" className="navClass" aria-label="About"><FlaskConical/></NavLink>
          </nav>
        </div>
      </header>

      <div id="app-shell">
        <Outlet />        
      </div>

      {/* Contact modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} contactEmail="nmath2211@outlook.com" />

      <footer>
        <p>Made by Nick Mathiasen</p>
        <a className="social-link" href="https://www.instagram.com/gundaminthewindow/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <SiInstagram />
        </a>
        <a className="social-link" href="https://www.linkedin.com/in/nick-mathiasen-704580368/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <Linkedin />
        </a>
        <a className="social-link" href={`https://github.com/${CONFIG.GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <SiGithub />
        </a>
      </footer>
    </div>
  );
}

export default App;
