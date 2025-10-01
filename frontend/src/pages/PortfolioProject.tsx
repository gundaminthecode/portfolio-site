import { Link } from 'react-router-dom';

export default function PortfolioProject() {
    return (
        <div id='content-stack'>
            <Link to="/" className='back-link'>← Back to Home</Link>
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
