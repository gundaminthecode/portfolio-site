// pages/AboutMe.tsx

// This component displays an "About Me" page with GitHub profile information.

import { Link } from 'react-router-dom';
import { CONFIG } from '../config';
import { useGithubUser } from '../hooks/useGithubUser';

export default function AboutMe() {
  const { user, loading, error } = useGithubUser(CONFIG.GITHUB_USERNAME);

  return (
    <div id='content-stack'>
      <Link to="/" className='back-link'>Back</Link>

      <div className='content-slice'>
        <div className='slice-content'>
          {user ? (
            <section className="github-profile-panel app-divs">
              <img className="gh-avatar" src={user.avatar_url} alt={`${user.name ?? user.login} avatar`} />
              <div className="gh-main">
                <h1 className="gh-name">
                  <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                    {user.name ?? user.login} - Nick Mathiasen
                  </a>
                </h1>
                {user.bio && <p className="gh-bio">{user.bio}</p>}
                <ul className="gh-meta">
                  {user.location && <li>📍 {user.location}</li>}
                  {user.company && <li>🏢 {user.company}</li>}
                  <li>👥 {user.followers} followers · {user.following} following</li>
                  <li>📦 {user.public_repos} public repos</li>
                </ul>
                <div className="gh-actions">
                  <a className="btn" href={user.html_url} target="_blank" rel="noopener noreferrer">GitHub</a>
                  {user.blog && user.blog.trim() && (
                    <a className="btn btn--ghost" href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  )}
                </div>
              </div>
            </section>
          ) : loading ? (
            <p>Loading profile…</p>
          ) : error ? (
            <p style={{ color: "crimson" }}>Profile error: {error}</p>
          ) : null}

          <h1>About Me</h1>
          <p>Hello! I'm Nick, an emerging developer specializing in web applications and interactive experiences. I have a passion for creating engaging and user-friendly digital solutions.</p>
          <p>My journey into development began with a curiosity for how websites and applications work, leading me to learn various programming languages and frameworks. I enjoy tackling complex problems and turning ideas into reality through code.</p>
        </div>
      </div>
    </div>
  );
}