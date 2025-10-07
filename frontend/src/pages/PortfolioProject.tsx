import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
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
    useScrollReveal();
    

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
                            <img src={moodBoardImage} alt="Mood Board" />
                    </div>
                    <div className='development-slice'>
                        <h2>Concepts</h2>
                            <h3>Initial Wireframes</h3>
                                <img src={wireframe1} alt="Wireframe 1" />
                                <img src={wireframe2} alt="Wireframe 2" />
                            <h3>Potential Styleguide</h3>
                                <img src={potStyleGuideImage1} alt="Potential Styleguide" />
                                <img src={potStyleGuideImage2} alt="Potential Styleguide" />
                        <h2>Post Pitch Redesign</h2>
                            <h3>Initial Homepage Redesign</h3>
                                <img src={initialRedesignImage} alt="Initial Homepage Redesign" />
                            <h3>Refinement Concepts</h3>
                                <img src={refinementConcepts} alt="Refinement Concepts" />
                    </div>
                    <div className='development-slice'>
                        <h2>Development Outcomes</h2>
                            <h3>Pitch Product</h3>
                                <p>This was the version of the site used within the pitch presentation in Week 8.</p>
                                <img src={pitchOutcomeImageMobile1} alt="Mobile Outcome 1" />
                                <img src={pitchOutcomeImageMobile2} alt="Mobile Outcome 2" />
                                <img src={pitchOutcomeImageDesktop1} alt="Desktop Outcome 1" />
                                <img src={pitchOutcomeImageDesktop2} alt="Desktop Outcome 2" />
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
                </div>
            </div>
            <div className='content-slice portfolio-info-slices'>
                <div className='slice-content'>
                    <h1>Future Plan</h1>
                </div>
            </div>
        </div>
    );
}
