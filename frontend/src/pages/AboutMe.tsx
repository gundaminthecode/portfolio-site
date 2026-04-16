// pages/AboutMe.tsx
// This component displays an "About Me" page with GitHub profile information.

import { useNavigate } from 'react-router-dom';
import GithubProfilePanel from '../components/GithubProfilePanel';

export default function AboutMe() {
  const navigate = useNavigate();

  return (
    <>
      <button type="button" className='back-link' onClick={() => navigate(-1)}>Previous Page</button>


      <div id='parent-stack'>

        <div id='content-stack'>
          <div className='content-slice'>
            <div className='slice-content'>

              <h1>About Me</h1>
              <p>Hello! I'm Nick, an emerging developer specializing in web applications and interactive experiences. I have a passion for creating engaging and user-friendly digital solutions.</p>
              <p>My journey into development began with a curiosity for how websites and applications work, leading me to learn various programming languages and frameworks. I enjoy tackling complex problems and turning ideas into reality through code.</p>
            
              <h2>Skills & Interests</h2>
              <p>Placeholder</p>

            </div>
          </div>
        </div>

        <div id='content-sidebar'>
          <div className='content-slice'>
            <div className='slice-content'>

              <GithubProfilePanel />

            </div>
          </div>
        </div>

      </div>
    </>
  );
}