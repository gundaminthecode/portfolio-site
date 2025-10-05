import { Link } from 'react-router-dom';

export default function AboutMe() {
    return (
        <div id='content-stack'>
            <Link to="/" className='back-link'>Back</Link>
            <div className='content-slice'>
                <div className='slice-content'>
                    <h1>About Me</h1>
                    <p>Hello! I'm Nick, an emerging developer specializing in web applications and interactive experiences. I have a passion for creating engaging and user-friendly digital solutions.</p>
                    <p>My journey into development began with a curiosity for how websites and applications work, leading me to learn various programming languages and frameworks. I enjoy tackling complex problems and turning ideas into reality through code.</p>
                </div>
                
            </div>
        </div>
    );
}