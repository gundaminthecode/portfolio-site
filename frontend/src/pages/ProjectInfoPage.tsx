// ProjectInfoPage.tsx
import { Link, useOutletContext, useParams, useSearchParams} from "react-router-dom";
import { useGithubRepos } from "../hooks/useGithubRepos";
import type { Repo } from "../components/Projects/ProjectCard";
import LivePreview from "../components/Projects/LivePreview";
import CaseStudy from "../components/Projects/CaseStudy";
import { useCaseStudy } from "../hooks/useCaseStudy";
import useScrollReveal from "../hooks/useScrollReveal";
import ProjectProgress from "../components/Progress/ProjectProgress";
import "../styles/project-info.css";
import { CONFIG } from "../config";

type OutletCtx = { repos?: Repo[] };

function formatK(n: number | undefined) {
  if (n == null) return "0";
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
}

export default function ProjectInfoPage() {
  useScrollReveal();

  const [qp] = useSearchParams()
  // Allow ?repo=owner/name to override; default to your portfolio repo
  const repoParam = qp.get("repo")
  const owner = repoParam?.split("/")[0] || CONFIG.GITHUB_USERNAME
  const repo = repoParam?.split("/")[1] || "portfolio-site"

  const { id } = useParams<{ id: string }>();

  // Prefer repos from the Projects page via <Outlet context={{ repos }} />
  // but still fetch if this page is loaded directly.
  const outlet = useOutletContext<OutletCtx | undefined>();
  const { repos: fetchedRepos, loading, error } = useGithubRepos();

  const repos = outlet?.repos ?? fetchedRepos;
  const project = repos.find((r) => String(r.id) === id);

  // Load case study from repo (CASESTUDY.md, etc.)
  const { loading: csLoading, markdown, frontmatter } = useCaseStudy(project);

  if (loading && !outlet?.repos) return <p>Loading…</p>;
  if (error && !outlet?.repos) return <p style={{ color: "crimson" }}>Error: {error}</p>;
  if (!project) return <div>Project not found.</div>;

  const liveHref = (project as any).live_url || (project as any).homepage || null;

  return (
    <div id="content-stack">
      {/* Hero */}
      <div className="content-slice" id="project-info-hero-slice">
        <div className="slice-content">
          <nav className="crumbs" style={{ marginBottom: ".5rem" }}>
            <Link to="/projects">← Back to Projects</Link>
          </nav>
          <header className="project-header">
            <h2>{project.name}</h2>
          </header>
        </div>
      </div>

      {/* Info slice (summary + body) */}
      <div className="content-slice" id="project-info-slice">
        <div className="slice-content">
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
                  <a className="btn" href={project.html_url} target="_blank" rel="noopener noreferrer">GitHub</a>
                  {liveHref && (
                    <a className="btn btn--ghost" href={liveHref} target="_blank" rel="noopener noreferrer">Live Site</a>
                  )}
                </div>
              </div>
            </aside>
          </aside>

          <div className="project-grid-wrapper app-divs">
            <div className="projects-content">
              <article className="project-body">
                <p className="project-desc">
                  {project.description || "No description provided."}
                </p>

                <ul className="project-stats-list">
                  <li><strong>Default branch:</strong> {(project as any).default_branch ?? "main"}</li>
                  <li><strong>Visibility:</strong> {(project as any).private ? "Private" : "Public"}</li>
                  {(project as any).license?.name && (
                    <li><strong>License:</strong> {(project as any).license.name}</li>
                  )}
                  {(project as any).open_issues_count != null && (
                    <li><strong>Open issues:</strong> {(project as any).open_issues_count}</li>
                  )}
                </ul>

                {csLoading ? (
                  <p className="hud">Loading case study…</p>
                ) : (
                  <CaseStudy
                    markdown={markdown}
                    title={frontmatter?.title ? `Case Study — ${frontmatter.title}` : "Case Study"}
                    hero={frontmatter?.hero}
                  />
                )}

                {liveHref && (
                  <div className="live-preview-block">
                    <h3>Live Preview</h3>
                    <LivePreview url={liveHref} title={`${project.name} – Live Preview`} />
                  </div>
                )}
              </article>
            </div>
          </div>
        </div>
      </div>

      <div className="content-slice" id="project-progress-slice">
        <div className="slice-content">
          <h1>Project Progress</h1>
          <p>Commit activity and notes from progress.md for {project.owner?.login}/{project.name}</p>
          <div className="project-grid-wrapper" style={{ width: "100%" }}>
            <ProjectProgress owner={owner} repo={repo} />
          </div>
        </div>
      </div>
    </div>
  );
}
