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
                        <h2>Mood Board</h2>
                            <div className='image-container'>
                                <img src={moodBoardImage} alt="Mood Board" />
                            </div>
                    </div>
                    <div className='development-slice'>
                        <h2>Concepts</h2>
                            <h3>Initial Wireframes</h3>
                                <div className='image-container'>
                                    <img src={wireframe1} alt="Wireframe 1" />
                                    <img src={wireframe2} alt="Wireframe 2" />
                                </div>
                                
                            <h3>Potential Styleguide</h3>
                                <div className='image-container'>
                                    <img src={potStyleGuideImage1} alt="Potential Styleguide" />
                                    <img src={potStyleGuideImage2} alt="Potential Styleguide" />
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
                        <h2>Development Outcomes</h2>
                            <h3>Pitch Product</h3>
                                <div className='text-container'>
                                    <p>This was the version of the site used within the pitch presentation in Week 8.</p>
                                </div>
                                <div className='image-container'>
                                    <img src={pitchOutcomeImageMobile1} alt="Mobile Outcome 1" />
                                    <img src={pitchOutcomeImageMobile2} alt="Mobile Outcome 2" />
                                </div>
                                <div className='image-container'>
                                    <img src={pitchOutcomeImageDesktop1} alt="Desktop Outcome 1" />
                                    <img src={pitchOutcomeImageDesktop2} alt="Desktop Outcome 2" />
                                </div>
                                

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
