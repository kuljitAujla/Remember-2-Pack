import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Remember 2 Pack</h1>
        <p className="hero-description">
          Never forget what to pack again! Our AI-powered packing assistant helps you create 
          personalized packing lists based on your trip details, destination, and activities.
        </p>
        <div className="cta-buttons">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>AI-Powered Recommendations</h3>
            <p>Get personalized packing suggestions based on your destination and activities.</p>
          </div>
          <div className="feature-card">
            <h3>Save Your Lists</h3>
            <p>Save and organize your packing lists for future trips.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Suggestions</h3>
            <p>Our AI considers weather, duration, and activities to suggest the perfect items.</p>
          </div>
        </div>
      </div>
    </div>
  );
}