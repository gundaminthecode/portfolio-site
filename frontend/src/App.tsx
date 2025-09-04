// App.tsx

import { NavLink, Outlet } from "react-router-dom";
import "./styles/App.css";

function App() {
  return (
    <>
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

      <main>
        <div className="hero-banner">
          <h1 className="hero-text" data-text="NICK MATHIASEN">NICK MATHIASEN</h1>
        </div>
        <div id="upper-content" >
          <div id="app-sidebar">
            <div className="app-divs">
              <p>Welcome to my portfolio site! Explore my projects and learn more about me.</p>
            </div>
            <div className="app-divs">

            </div>
          </div>
          <div id="app-main-content" className="app-divs">
            <Outlet />
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
        
      </main>

      <footer>
        <p>2025 Nick Mathiasen.</p>
      </footer>
    </>
  );
}

export default App;
