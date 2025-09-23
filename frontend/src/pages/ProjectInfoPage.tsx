// ProjectInfoPage.tsx
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useGithubRepos } from "../hooks/useGithubRepos";
import type { Repo } from "../components/Projects/ProjectCard";
import LivePreview from "../components/Projects/LivePreview";

type OutletCtx = { repos?: Repo[] };

function formatK(n: number | undefined) {
  if (n == null) return "0";
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
}

export default function ProjectInfoPage() {
  const { id } = useParams<{ id: string }>();

  // Prefer repos from the Projects page via <Outlet context={{ repos }} />
  // but still fetch if this page is loaded directly.
  const outlet = useOutletContext<OutletCtx | undefined>();
  const { repos: fetchedRepos, loading, error } = useGithubRepos();

  const repos = outlet?.repos ?? fetchedRepos;
  const project = repos.find((r) => String(r.id) === id);

  if (loading && !outlet?.repos) return <p>Loading…</p>;
  if (error && !outlet?.repos) return <p style={{ color: "crimson" }}>Error: {error}</p>;
  if (!project) return <div>Project not found.</div>;

  const liveHref = (project as any).live_url || (project as any).homepage || null;

  return (
    <div>
      <div id="upper-content">
        <section id="projects" className="projects-section">
          {/* Left rail: reuse filter panel styling for a neat summary card */}
          <aside className="filter-panel filter-panel--desktop app-divs">
            <aside className="projects-filters">
              <div className="project-summary-card">
                <h3 className="hud">Summary</h3>
                <ul className="project-stats">
                  <li><strong>Language:</strong> {project.language ?? "—"}</li>
                  <li><strong>Stars:</strong> {formatK(project.stargazers_count)}</li>
                  <li><strong>Forks:</strong> {formatK(project.forks_count)}</li>
                  <li>
                    <strong>Updated:</strong>{" "}
                    <time dateTime={project.updated_at}>
                      {new Date(project.updated_at).toLocaleDateString()}
                    </time>
                  </li>
                </ul>
                <div className="project-links" style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  <a className="btn" href={project.html_url} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                  {liveHref && (
                    <a className="btn btn--ghost" href={liveHref} target="_blank" rel="noopener noreferrer">
                      Live Site
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </aside>

          {/* Main content */}
          <div className="project-grid-wrapper app-divs">
            <div className="projects-content">
              <nav className="crumbs" style={{ marginBottom: ".75rem" }}>
                <Link to="/projects">← Back to Projects</Link>
              </nav>

              <header className="project-header" style={{ marginBottom: "1rem" }}>
                <h2>{project.name}</h2>
              </header>

              <article className="project-body">
                <p className="project-desc" style={{ marginBottom: "1rem" }}>
                  {project.description || "No description provided."}
                </p>

                <ul className="project-stats-list" style={{ display: "grid", gap: ".5rem", marginBottom: "1rem" }}>
                  <li><strong>Default branch:</strong> {(project as any).default_branch ?? "main"}</li>
                  <li><strong>Visibility:</strong> {(project as any).private ? "Private" : "Public"}</li>
                  {(project as any).license?.name && (
                    <li><strong>License:</strong> {(project as any).license.name}</li>
                  )}
                  {(project as any).open_issues_count != null && (
                    <li><strong>Open issues:</strong> {(project as any).open_issues_count}</li>
                  )}
                </ul>

                  {/* Live preview (only if allowed) */}
                  {liveHref && (
                    <div>
                      <h3 style={{ marginBottom: ".5rem" }}>Live Preview</h3>
                      <LivePreview url={liveHref} title={`${project.name} – Live Preview`} />
                    </div>
                  )}
                
              </article>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
