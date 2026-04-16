import { CONFIG } from '../config';
import { useGithubUser } from '../hooks/useGithubUser';
import "../styles/github-profile-panel.css";

export default function GithubProfilePanel() {
    const { user, loading, error } = useGithubUser(CONFIG.GITHUB_USERNAME);
    
    return (
      <>
        {user ? (
          <section className="github-profile-panel app-divs">
            <div id='gh-hero'>
                <img className="gh-avatar" src={user.avatar_url} alt={`${user.name ?? user.login} avatar`} />
                <h1 className="gh-name">
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                        {user.name ?? user.login}
                    </a>
                </h1>
            </div>

            <div className="gh-main">

              {user.bio && <p className="gh-bio">{user.bio}</p>}
              <ul className="gh-meta">
                {user.location && <li>📍 {user.location}</li>}
                {user.company && <li>🏢 {user.company}</li>}
                <li>👥 {user.followers} followers · {user.following} following</li>
                <li>📦 {user.public_repos} public repos</li>
              </ul>
              <div className="gh-actions">
                <a className="btn" href={user.html_url} target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </section>
        ) : loading ? (
          <p>Loading profile…</p>
        ) : error ? (
          <p style={{ color: "crimson" }}>Profile error: {error}</p>
        ) : null}
      </>
    );
}