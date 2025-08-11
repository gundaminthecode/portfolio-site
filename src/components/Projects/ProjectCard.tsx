// import React from "react";

// Export Repo type
export type Repo = {
    id: number; // Repository ID
    name: string; // Repository name
    description: string | null; // Repository description
    html_url: string; // URL to the repository on GitHub
    homepage?: string | null; // Live site URL, if available
    stargazers_count: number; // Number of stars the repository has received
    forks_count: number; // Number of forks the repository has
    language: string | null; // Primary programming language used in the repository
    updated_at: string; // Last updated date in ISO format
    fork: boolean; // Whether the repository is a fork of another repository
    archived: boolean; // Whether the repository is archived
}

// Format the date to a more readable format
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString();
}

// Export the ProjectCard component
export default function ProjectCard({ repo }: { repo: Repo }) {
    const live = repo.homepage && repo.homepage.trim().length > 0 ? repo.homepage : undefined;

    return (
        <article className="project-card">
        <header className="project-card__header">
            <h3 className="project-card__title">{repo.name}</h3>
        </header>

        {repo.description && <p className="project-card__desc">{repo.description}</p>}

        <ul className="project-card__meta">
            {repo.language && <li>{repo.language}</li>}
            <li>★ {repo.stargazers_count}</li>
            <li>⑂ {repo.forks_count}</li>
            <li>Updated {formatDate(repo.updated_at)}</li>
        </ul>

        <div className="project-card__links">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">View Repo</a>
            {live && (
            <a href={live} target="_blank" rel="noopener noreferrer">Live Site</a>
            )}
        </div>
        </article>
    );
}