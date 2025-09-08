// App.tsx

import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./styles/App.css";
import { AnimatePresence, motion, type Transition } from "framer-motion";

const swipeTransition: Transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const, // 👈 tuple, not number[]
};

function App() {
  const location = useLocation();

  return (
    <div id="app-container">
      <header>
        <nav>
          <ul>
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/projects">Projects</NavLink></li>
            {/* These go to sections on the Home page */}
            <li><a href="#/##about">About</a></li>
            <li><a href="#/##contact">Contact</a></li>
          </ul>
        </nav>
      </header>

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
