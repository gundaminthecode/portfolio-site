// App.tsx

import './styles/App.css';
import GithubProjects from "./components/Projects/GithubProjects.tsx";

function App() {
  return (
    <>
      <header>
        <h1 className="hero-text" data-text="NICK MATHIASEN">NICK MATHIASEN</h1>
        <nav>
          <ul>
            <li><a href="#about">About Me</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        {/* <Projects /> */}

        <GithubProjects 
          username="gundaminthecode"
          includeForks={false}
          includeArchived={false}
          sortBy="updated"   // or "stars"
          // max={12}
        />

        <section id="about">
          <h2>About Me</h2>
          <p>This is a brief introduction about myself.</p>
        </section>

        <section id="contact">
          <h2>Contact Me</h2>
          <p>
            You can reach me via email at{' '}
            <a href="mailto:nmath2211@outlook.com">nmath2211@outlook.com</a>
          </p>
        </section>
      </main>

      <footer>
        <p>2025 Nick Mathiasen.</p>
      </footer>
    </>
  );
}

export default App;
