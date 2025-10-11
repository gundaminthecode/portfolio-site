// pages/PortfolioProject.tsx

// This component displays a detailed breakdown of the custom developed web-portfolio project.
// Basic hard-coded structure for ease of implementation, future versions may pull from markdown files

import { Link } from 'react-router-dom';
import "../styles/portfolio-project-page.css"
import { useState } from "react";
import ImageModal from "../components/ImageModal";

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
    refinementConcepts,
    feedbackFormImage1,
    feedbackFormImage2,
    feedbackFormImage3,
    feedbackFormImage4,
} from '../assets/portfolio-project/index.ts';
import KeenImageCarousel from '../components/Carousel/KeenImageCarousel.tsx';
import DiagonalHexBackground from '../components/Background/DiagonalHexBackground.tsx';


export default function PortfolioProject() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<{src: string, alt?: string} | null>(null);

  const openModal = (src: string, alt?: string) => {
    setModalImg({ src, alt });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

    return (
        <div id='content-stack'>
            <Link to="/" className='back-link'>Back</Link>
            <div className='content-slice portfolio-info-slices'>
                <div className='slice-content'>
                    <h1>Custom Developed Web-Portfolio</h1>
                </div>
            </div>
            <div className='content-slice portfolio-info-slices'>
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <h1>About This Project</h1>
                </div>
            </div>

            <div className='content-slice portfolio-info-slices'>
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <div className='development-slice'>
                        <h2>IDEATION</h2>
                        <div className='text-container'>
                            <p>
                                The project began with the concept of building a custom-coded interactive portfolio to act as a central hub for showcasing my technical expertise and aligning with employer expectations. During this phase, I researched existing developer portfolios, identified gaps in template-driven solutions, and outlined the value of creating a scalable, hand-built site. During this phase, I also begun development of my own visual style, leaning heavily into the aesthetics of late 90s and early 2000s vector-aesthetics. 
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className='content-slice portfolio-info-slices'>
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <div className='development-slice'>
                        <h2>MOOD BOARD</h2>
                        <div className='image-container'>
                            <img
                              src={moodBoardImage}
                              alt="Mood Board"
                              style={{ cursor: "pointer" }}
                              onClick={() => openModal(moodBoardImage, "Mood Board")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='content-slice portfolio-info-slices'>
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <div className='development-slice'>
                        <h2>CONCEPTS</h2>
                        <h3>Initial Wireframes</h3>
                        <div className='image-container'>
                            <KeenImageCarousel 
                                images={[
                                    wireframe1,
                                    wireframe2,
                                ]}
                                onImageClick={openModal}
                                alt="Initial Wireframe Image"
                            /> 
                        </div>                                
                        <h3>Potential Styleguide</h3>
                        <div className='image-container'>
                            <KeenImageCarousel 
                                images={[
                                    potStyleGuideImage1,
                                    potStyleGuideImage2,
                                ]} 
                                onImageClick={openModal}
                                alt="Potential Styleguide Image"
                            /> 
                        </div>
                    </div>
                </div>
            </div>

            <div className='content-slice portfolio-info-slices'>
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <div className='development-slice'>
                        <h2>POST PITCH REDESIGN</h2>
                        <h3>Initial Homepage Redesign</h3>
                        <div className='image-container'>
                            <img 
                                src={initialRedesignImage} 
                                alt="Initial Homepage Redesign"
                                style={{ cursor: "pointer" }}
                                onClick={() => openModal(initialRedesignImage, "Initial Homepage Redesign")}
                            />
                        </div>
                        <h3>Refinement Concepts</h3>
                        <div className='image-container'>
                            <img 
                                src={refinementConcepts} 
                                alt="Refinement Concepts" 
                                style={{ cursor: "pointer" }}
                                onClick={() => openModal(refinementConcepts, "Refinement Concepts")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='content-slice portfolio-info-slices'>
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <div className='development-slice'>
                        <h2>CREATION</h2>
                        <div className='text-container'>
                            <p>
                                The creation phase involved coding the site from scratch using React, Vite, TypeScript, CSS, and Python for backend integration. I implemented core features such as GitHub repository fetching, a project carousel, and responsive design. This phase also included backend deployment via Render and domain setup through Cloudflare, ensuring the site functions as a professional, deployable product rather than a static prototype.
                            </p>
                        </div>
                        <h3>Pitch Product</h3>
                        <div className='text-container'>
                            <p>This was the version of the site used within the pitch presentation in Week 8.</p>
                        </div>
                        <div className='image-container'>
                            <KeenImageCarousel 
                                images={[
                                    pitchOutcomeImageMobile1,
                                    pitchOutcomeImageMobile2,
                                    pitchOutcomeImageDesktop1,
                                    pitchOutcomeImageDesktop2,
                                ]}
                                onImageClick={openModal}
                                alt="Pitch Product Images" 
                            /> 
                        </div>
                    </div>
                </div>
            </div>

            <div className='content-slice portfolio-info-slices'>
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <div className='development-slice'>
                        <h2>REFINEMENT</h2>
                        <div className='text-container'>
                            <p>
                                Mentor feedback emphasized experimenting with visual identity and improving navigation clarity, which I addressed by refining my UI elements and layout. This included reconsidering colour usage for stronger hierarchy, adjusting navigation/button positioning, and exploring scalable structures for project display. This stage ensures the portfolio not only demonstrates technical competence but also feels user-friendly and reflective of my individual brand.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='content-slice portfolio-info-slices'>
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <h1>FEEDBACK</h1>
                    <h2>Feedback Round 1</h2>
                    <div className='feedback-grid'>
                        <div className='feedback-item'>
                            <h3>Ben</h3>
                            <h4>(Former) J2EE Analyst Programmer</h4>
                            <p>Standouts:</p>
                            <ul>
                                <li>Consistent Theming and Bold Styling </li>
                            </ul>
                            <p>Improvements:</p>
                            <ul>
                                <li>Demonstrate the tech-stack better.</li>
                                <li>Inspiration aesthetics relied on neutral colours to compliment the bold colours.</li>
                                <li>Implement case studies for projects. Currently hard to understand what they are, how they were made and what skills they involve.</li>
                            </ul>
                        </div>
                        <div className='feedback-item'>
                            <h3>Frazer</h3>
                            <h4>Information Technology Graduate</h4>
                            <p>Standouts:</p>
                            <ul>
                                <li>Valuable Concept, Professional Representation</li>
                            </ul>
                            <p>Improvements:</p>
                            <ul>
                                <li>Develop a wider range of Visual Assets.</li>
                                <li>Improve Navigation, not intuitive in it's current state.</li>
                                <li>Explore MDX (Markdown + React) for embedding case studies and live previews.</li>
                                <li>Try Storybook for isolating UI components.</li>
                            </ul>
                        </div>
                        <div className='feedback-item'>
                            <h3>Alvin</h3>
                            <h4>Frontend Web Developer</h4>
                            <p>Standouts:</p>
                            <ul>
                                <li>Styling, Use of Current/Popular Frameworks</li>
                            </ul>
                            <p>Improvements:</p>
                            <ul>
                                <li>Improve accessibility. Some features not functional on mobile. </li>
                                <li>Screen reader support is important for making a product as accessible as possible.</li>
                            </ul>
                        </div>
                    </div>
                    <h2>Feedback Round 2</h2>
                        <div className='image-container'>
                                <KeenImageCarousel 
                                    images={[
                                        feedbackFormImage1,
                                        feedbackFormImage2,
                                        feedbackFormImage3,
                                    ]}
                                    onImageClick={openModal}
                                    alt="Feedback Form Image" 
                                /> 
                            </div>
                    <div className='text-container'>
                        <div className="feedback-form-result">
                            <div className="feedback-form-comments">
                                <h3>General Comments</h3>
                                <p><strong>Standouts:</strong></p>
                                <div className='image-container'>
                                    <img 
                                        src={feedbackFormImage4} 
                                        alt="Feedback Form Standout"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => openModal(feedbackFormImage4, "Feedback Form Standout")} 
                                    />
                                </div>
                                <ul>
                                    <li>"The character and flair of the visual elements and how cleanly it's incorporated into the design."</li>
                                    <li>"Great, it's not too distracting but still carries a lot of personality in its design. The core components of what makes a portfolio is also captured very well within each page."</li>
                                    <li>"I think it's a strong project, that achieves its goals."</li>
                                </ul>
                                <p><strong>Suggestions for Improvement:</strong></p>
                                <ul>
                                    <li>"The rotating carousel on the home page was very laggy, and struggled to function correctly on my machine. This would likely be identified and fixed on a full scale project, but that kind of testing is beyond the scope of this project, and as such is easily forgiven."</li>
                                    <li>"The interactive cube at the landing page is very sensitive to scrolling and would fast track too easily. If that can be calibrated that would be more than enough."</li>
                                </ul>
                            </div>
                        </div>
                        {/* Feedback Template End */}
                    </div>
                </div>
            </div>
            <div className='content-slice portfolio-info-slices'>
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <h1>REFLECTION</h1>
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
                <DiagonalHexBackground route="BR_TL" zIndex={-1} />
                <div className='slice-content'>
                    <h1>FUTURE PLAN</h1>
                    <div className='text-container'>
                        <p>As this portfolio has been designed to be scalable, reusable and updatable, I will continue to use it as a platform for developing my skills as a web-developer. There will most likely be new aesthetics that I will pivot the site to work towards, and new technologies and ideas I would like to integrate and use to potentially replace older and more outdated ones.</p>
                        <p>Past this project, I aim to update my older projects with basic information to fill out their respective information pages as well as build new projects with the information needed by the website.</p>
                    </div>
                </div>
            </div>
            <ImageModal
                src={modalImg?.src || ""}
                alt={modalImg?.alt}
                open={modalOpen}
                onClose={closeModal}
            />
        </div>
    );
}
