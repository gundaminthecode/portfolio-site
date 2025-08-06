import './App.css';
import Projects from "./components/Projects/Projects";

function App() {
  return (
    <>
      <header>
        <h1>Welcome to My Portfolio</h1>
        <nav>
          <ul>
            <li><a href="#about">About Me</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="about">
          <h2>About Me</h2>
          <p>This is a brief introduction about myself.</p>
        </section>

        {/* <section id="projects">
          <h2>My Projects</h2>
          <p>Here are some of the projects I've worked on.</p>

          <div className="project-list">
            <div className="project-card">Project 1</div>
            <div className="project-card">Project 2</div>
            <div className="project-card">Project 3</div>
          </div>
        </section> */}

        <Projects />

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
