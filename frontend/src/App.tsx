// App.tsx

import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./styles/App.css";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { Home, FolderGit2, User2, Mail } from "lucide-react";
import BrokenShapeEl from "./components/Background/BrokenShape";

const swipeTransition: Transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const, // 👈 tuple, not number[]
};

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "sidebar-nav__link is-active" : "sidebar-nav__link";

function App() {
  const location = useLocation();

  return (
    <div id="app-container">
      {/* Site-wide animated background */}
      <div id="site-bg" aria-hidden="true">
        <BrokenShapeEl
          cols={18}
          rows={18}
          amp={24}
          speed={0.9}
          colors="var(--bs-col-1) var(--bs-col-2) var(--bs-col-3) var(--bs-col-4)"
        />
      </div>

      <header>
        {/* Knockout overlay */}
        <svg className="header-cutout" aria-hidden="true" focusable="false">
          <defs>
            <mask id="header-cutout-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <text x="32" y="50%" dy=".35em" fill="black" className="header-cutout__text">NICK.DEV</text>
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="var(--header-colour)" mask="url(#header-cutout-mask)" />
        </svg>

        <div id="logo-container">
          <a href="/" className="logo" aria-label="Home">NICK.DEV</a>
        </div>
        <div id="nav-container">
          <nav id="navBar" aria-label="Primary">
            <NavLink to="/" end className={navClass} aria-label="Home"><Home size={24} /></NavLink>
            <NavLink to="/projects" className={navClass} aria-label="Projects"><FolderGit2 size={24} /></NavLink>
            <a href="#/##about" className="navBar__link" aria-label="About"><User2 size={24} /></a>
            <a href="#/##contact" className="navBar__link" aria-label="Contact"><Mail size={24} /></a>
          </nav>
        </div>
      </header>

      <div id="app-shell">
        {/* Page transition wrapper */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}            // re-animate on route change
            initial={{ x: 40, opacity: 0 }}    // enter from right
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}      // exit to left
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
