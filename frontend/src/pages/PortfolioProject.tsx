// pages/PortfolioProject.tsx

// This component displays a detailed breakdown of the custom developed web-portfolio project.
// Basic hard-coded structure for ease of implementation, future versions may pull from markdown files

import { Link } from 'react-router-dom';
import "../styles/portfolio-project-page.css"

import {
    moodBoardImage,
    wireframe1,
    wireframe2,
    potStyleGuideImage1,
    potStyleGuideImage2,
    pitchOutcomeImageMobile1,
    pitchOutcomeImageMobile2,
    pitchOutcomeImageDesktop1,
    pitchOutcomeImageDesktop2,
    initialRedesignImage,
    refinementConcepts
} from '../assets/portfolio-project/index.ts';
import KeenImageCarousel from '../components/Carousel/KeenImageCarousel.tsx';


export default function PortfolioProject() {    

    return (
        <div id='content-stack'>
            <Link to="/" className='back-link'>Back</Link>
            <div className='content-slice portfolio-info-slices'>
                <div className='slice-content'>
                    <h1>Custom Developed Web-Portfolio</h1>
                </div>
            </div>
            <div className='content-slice portfolio-info-slices'>
                <div className='slice-content'>
                    <h1>About This Project</h1>
                </div>
            </div>
            <div className='content-slice portfolio-info-slices'>
                <div className='slice-content'>
                    <h1>Development</h1>
                    <div className='development-slice'>
                        <h2>Ideation</h2>
                            <p>
                                The project began with the concept of building a custom-coded interactive portfolio to act as a central hub for showcasing my technical expertise and aligning with employer expectations. During this phase, I researched existing developer portfolios, identified gaps in template-driven solutions, and outlined the value of creating a scalable, hand-built site. During this phase, I also begun development of my own visual style, leaning heavily into the aesthetics of late 90s and early 2000s vector-aesthetics. 
                            </p>
                        <h2>Mood Board</h2>
                            <div className='image-container'>
                                <img src={moodBoardImage} alt="Mood Board" />
                            </div>
                    </div>
                    <div className='development-slice'>
                        <h2>Concepts</h2>
                            <h3>Initial Wireframes</h3>
                                <div className='image-container'>
                                    <KeenImageCarousel images={[
                                        wireframe1,
                                        wireframe2,
                                    ]} /> 
                                </div>                                
                            <h3>Potential Styleguide</h3>
                                <div className='image-container'>
                                    <KeenImageCarousel images={[
                                        potStyleGuideImage1,
                                        potStyleGuideImage2,
                                    ]} /> 
                                </div>
                        <h2>Post Pitch Redesign</h2>
                            <h3>Initial Homepage Redesign</h3>
                                <div className='image-container'>
                                    <img src={initialRedesignImage} alt="Initial Homepage Redesign" />
                                </div>
                            <h3>Refinement Concepts</h3>
                                <div className='image-container'>
                                    <img src={refinementConcepts} alt="Refinement Concepts" />
                                </div>
                    </div>
                    <div className='development-slice'>
                        <h2>Creation</h2>
                            <p>
                                The creation phase involved coding the site from scratch using React, Vite, TypeScript, CSS, and Python for backend integration. I implemented core features such as GitHub repository fetching, a project carousel, and responsive design. This phase also included backend deployment via Render and domain setup through Cloudflare, ensuring the site functions as a professional, deployable product rather than a static prototype. 
                            </p>
                        
                            <h3>Pitch Product</h3>
                                <div className='text-container'>
                                    <p>This was the version of the site used within the pitch presentation in Week 8.</p>
                                </div>
                                <div className='image-container'>
                                    <KeenImageCarousel images={[
                                        pitchOutcomeImageMobile1,
                                        pitchOutcomeImageMobile2,
                                        pitchOutcomeImageDesktop1,
                                        pitchOutcomeImageDesktop2,
                                    ]} /> 
                                </div>
                                                       
                        <h2>Refinement</h2>
                            <p>
                                Mentor feedback emphasized experimenting with visual identity and improving navigation clarity, which I addressed by refining my UI elements and layout. This included reconsidering colour usage for stronger hierarchy, adjusting navigation/button positioning, and exploring scalable structures for project display. This stage ensures the portfolio not only demonstrates technical competence but also feels user-friendly and reflective of my individual brand. 
                            </p>

                    </div>
                </div>
            </div>
            <div className='content-slice portfolio-info-slices'>
                <div className='slice-content'>
                    <h1>Feedback</h1>
                </div>
            </div>
            <div className='content-slice portfolio-info-slices'>
                <div className='slice-content'>
                    <h1>Reflection</h1>
                    <div className='text-container'>
                        <p>This project has been a deep undertaking for me. Throughout my time in all my courses, I have learned a variety of skills that are relatively simple in practice, but have never had the opportunity to use them together and put them to real world practice.</p>
                        <p>
                            My largest struggle with this project was the styling of the website. As many of my courses have had a major focus on functionality over aesthetics, working towards a cohesive and satisfactory personal style has been a hurdle I have attempted to overcome.<br />
                            After the project pitch in Week 8, I became extremely dissatisfied with the aesthetic direction my project was heading in, leaning more and more away from the late 90s to early 2000s vector aesthetic I wanted to achieve. This can be seen in the PITCH PRODUCT outcome.<br />
                            This began a redesign sprint within the final weeks of the project, which could've been prevented with better planning and a clear aesthetic goal for the site in the beginning.
                        </p>
                        <p>Bringing all of my web-development skills together was another pain point. Many projects that I have worked on in the past have been small snippets of what can be done as part of a cohesive final product, but I had never actually put all the work together.</p>
                        <p>This project also leaves some features to be desired, such as the lack of social media integrations (LinkedIn in particular) due to the lack of support within official APIs for the features which I wanted to implement.</p>
                        <p>However, this portfolio has been designed to be automatically scalable, with the GitHub integrations allowing for automatic inclusion and updating of new projects, and the ability to read custom Case Study and Progress markdown files to fill out the dedicated project pages.</p>
                        <p>Overall, I am satisfied with the outcome of this project, but there is lots of room for improvement and the display of my skills.</p>
                    </div>
                    
                </div>
            </div>
            <div className='content-slice portfolio-info-slices'>
                <div className='slice-content'>
                    <h1>Future Plan</h1>
                    <div className='text-container'>
                        <p>As this portfolio has been designed to be scalable, reusable and updatable, I will continue to use it as a platform for developing my skills as a web-developer. There will most likely be new aesthetics that I will pivot the site to work towards, and new technologies and ideas I would like to integrate and use to potentially replace older and more outdated ones.</p>
                        <p>Past this project, I aim to update my older projects with basic information to fill out their respective information pages as well as build new projects with the information needed by the website.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
