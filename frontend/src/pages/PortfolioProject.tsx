import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';

export default function PortfolioProject() {
    useScrollReveal();
    

    return (
        <div id='content-stack'>
            <Link to="/" className='back-link'>Back</Link>
            <div className='content-slice'>
                <div className='slice-content'>
                    <h1>Custom Developed Web-Portfolio</h1>
                </div>
            </div>
            <div className='content-slice'>
                <div className='slice-content'>
                    <h1>About This Project</h1>
                </div>
            </div>
            <div className='content-slice'>
                <div className='slice-content'>
                    <h1>Development</h1>
                </div>
            </div>
            <div className='content-slice'>
                <div className='slice-content'>
                    <h1>Feedback</h1>
                </div>
            </div>
            <div className='content-slice'>
                <div className='slice-content'>
                    <h1>Reflection</h1>
                </div>
            </div>
            <div className='content-slice'>
                <div className='slice-content'>
                    <h1>Future Plan</h1>
                </div>
            </div>
        </div>
    );
}
