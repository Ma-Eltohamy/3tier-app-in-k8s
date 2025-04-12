import React from 'react';
import './style/LandingPage.css';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

import Sidebar from "./components/Sidebar";
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="landing-page">
            <Sidebar logo={<i className="bx bxs-school"></i>} name="FCIH " openOnHover={false}></Sidebar>
            <section className="hero">
                <div className="hero-content">
                    <h1>Learn Anything, Anytime, Anywhere</h1>
                    
                    <Link to="./Login" className="cta-button">Manage</Link>
                </div>
            </section>
            <section className="features" id="features">
                <h2>Features</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        
                        <h3>Expert Instructors</h3>
                        <p>Our courses are taught by industry experts with years of experience in their fields.</p>
                    </div>
                    <div className="feature-card">
                        
                        <h3>Flexible Learning</h3>
                        <p>Learn at your own pace and on your own schedule with our self-paced courses.</p>
                    </div>
                    <div className="feature-card">
                        
                        <h3>Interactive Content</h3>
                        <p>Engage with our interactive course content and get hands-on experience with real-world projects.</p>
                    </div>
                </div>
            </section>
            <footer className="footer">
                <div className="footer-content">
                    <img src="logo.png" alt="Logo" className="logo" />
                    
                    <div className="social-media">
                        <a href="#"><i className="fab fa-facebook"><FaFacebook /></i></a>
                        <a href="#"><i className="fab fa-twitter"><FaTwitter /></i></a>
                        <a href="#"><i className="fab fa-instagram"><FaInstagram /></i></a>
                    </div>
                </div>
            
            </footer>
        </div>
    );
}

export default LandingPage;
