// App.tsx

import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./styles/App.css";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { Home, FolderGit2, User2, Mail } from "lucide-react";

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
      <header>
        <nav className="mobile-nav" aria-label="Primary (icons)">
          <NavLink to="/" end className={navClass} aria-label="Home">
            <Home size={22} />
          </NavLink>
          <NavLink to="/projects" className={navClass} aria-label="Projects">
            <FolderGit2 size={22} />
          </NavLink>
          <a href="#/##about" className="mobile-nav__link" aria-label="About">
            <User2 size={22} />
          </a>
          <a href="#/##contact" className="mobile-nav__link" aria-label="Contact">
            <Mail size={22} />
          </a>
        </nav>
      </header>

       {/* Right-side icon rail (desktop only via CSS) */}
      <nav className="sidebar-nav" aria-label="Primary">
        <NavLink to="/" end className={navClass} aria-label="Home"><Home size={24} /></NavLink>
        <NavLink to="/projects" className={navClass} aria-label="Projects"><FolderGit2 size={24} /></NavLink>
        <a href="#/##about" className="sidebar-nav__link" aria-label="About"><User2 size={24} /></a>
        <a href="#/##contact" className="sidebar-nav__link" aria-label="Contact"><Mail size={24} /></a>
      </nav>

      <div className="hero-banner">
        <h1 className="hero-text" data-text="NICK MATHIASEN">NICK MATHIASEN</h1>
      </div>

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
        <p>2025 Nick Mathiasen.</p>
      </footer>
    </div>
  );
}

export default App;
