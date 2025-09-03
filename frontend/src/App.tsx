// App.tsx

import { NavLink, Outlet } from "react-router-dom";
import "./styles/App.css";

function App() {
  return (
    <>
      <header>
        <h1 className="hero-text" data-text="NICK MATHIASEN">NICK MATHIASEN</h1>
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

      <main>
        <Outlet />
      </main>

      <footer>
        <p>2025 Nick Mathiasen.</p>
      </footer>
    </>
  );
}

export default App;
