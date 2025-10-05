// App.tsx

import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./styles/App.css";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { Home, FolderGit2, User2, Mail } from "lucide-react";
import BrokenShapeEl from "./components/Background/BrokenShape";
import { useEffect } from "react";

const swipeTransition: Transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "sidebar-nav__link is-active" : "sidebar-nav__link";

function App() {
  const location = useLocation();

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
      {/* Site-wide animated background */}
      <div id="site-bg" aria-hidden="true">
        <BrokenShapeEl
          cols={12}
          rows={14}
          amp={15}
          speed={0.1}
          colors="var(--bs-col-1) var(--bs-col-2) var(--bs-col-3) var(--bs-col-4)"
        />
      </div>

      {/* Left Side Rectangle */}
      <div className="left-rectangle" aria-hidden="true" />

      <header>
        {/* Knockout overlay */}
        <svg className="header-cutout" aria-hidden="true" focusable="false">
          <defs>
            <mask id="header-cutout-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <text x="32" y="50%" dy=".35em" fill="black" className="header-cutout__text">NICK.DEV</text>
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="color-mix(in oklab, var(--header-colour) 85%, transparent)" mask="url(#header-cutout-mask)" />
        </svg>

        <div id="logo-container">
          <a href="/" className="logo" aria-label="Home">NICK.DEV</a>
        </div>
        <div id="nav-container">
          <nav id="navBar" aria-label="Primary">
            <NavLink to="/" end className={navClass} aria-label="Home"><Home size={24} /></NavLink>
            <NavLink to="/projects" className={navClass} aria-label="Projects"><FolderGit2 size={24} /></NavLink>
            <NavLink to="/about-me" className={navClass} aria-label="About"><User2 size={24} /></NavLink>
            <a href="#/##contact" className="navBar__link" aria-label="Contact"><Mail size={24} /></a>
          </nav>
        </div>
      </header>

      <div id="app-shell">
        {/* Page transition wrapper */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={swipeTransition}
            style={{ willChange: "transform, opacity" }}
            className="page"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    
      <footer>
        <p>Made by Nick - <a href="https://github.com/gundaminthecode">GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;
