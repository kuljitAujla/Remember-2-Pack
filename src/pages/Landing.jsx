import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css';
import Header from '../components/Header';

export default function Landing() {
  return (
    <div className="landing-page">
      <Header />
      
      <div className="landing-container">
        <section className="hero-section">
          <h1 className="hero-title">Never forget what to pack again</h1>
          <p className="hero-description">
            Add items to your bag, describe your trip, and get AI-powered recommendations 
            for everything else you need — organized by category.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </section>

        <section className="how-it-works">
          <h2 className="section-title">How it works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Add items to your bag</h3>
              <p>Start by adding the items you already know you need to pack.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Describe your trip</h3>
              <p>Tell us about your destination, activities, weather, and duration.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get AI recommendations</h3>
              <p>Receive categorized suggestions based on your response.</p>
            </div>
          </div>
        </section>

        <section className="features">
          <h2 className="section-title">What makes us different</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Smart AI Recommendations</h3>
              <p>Get personalized suggestions based on your specific trip details and activities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Organized Categories</h3>
              <p>Items are sorted into clear categories like toiletries, clothing, and essentials.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Commonly Forgotten Items</h3>
              <p>We remind you of items people often forget like chargers, medications, and travel documents.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to pack smarter?</h2>
          <p>Join thousands of travelers who never forget essentials again.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Start Packing</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </section>
      </div>
    </div>
  );
}