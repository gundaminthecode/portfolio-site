import { useParams, Link } from "react-router-dom";
import { useGithubRepos } from "../hooks/useGithubRepos";
// import type { Repo } from "../components/Projects/ProjectCard";

export default function ProjectInfoPage() {
  const { id } = useParams<{ id: string }>();
  const { repos, loading, error } = useGithubRepos();
  const project = repos.find(r => String(r.id) === id);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="project-info-page">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <ul>
        <li>Language: {project.language}</li>
        <li>Stars: {project.stargazers_count}</li>
        <li>Forks: {project.forks_count}</li>
        <li>Updated: {new Date(project.updated_at).toLocaleDateString()}</li>
      </ul>
      <a href={project.html_url} target="_blank" rel="noopener noreferrer">
        View on GitHub
      </a>
      {project.live_url && (
        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
          Live Site
        </a>
      )}
      <br />
      <Link to="/projects">Back to Projects</Link>
    </div>
  );
}