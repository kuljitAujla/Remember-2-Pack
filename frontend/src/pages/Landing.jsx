import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landingPage.css';
import Header from '../components/Header';

export default function Landing() {
  return (
    <div className="landing-page">
      <Header />
      
      {/* Hero Section with Background Animation */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element element-1">🧳</div>
            <div className="floating-element element-2">✈️</div>
            <div className="floating-element element-3">🌍</div>
            <div className="floating-element element-4">🎒</div>
            <div className="floating-element element-5">📱</div>
            <div className="floating-element element-6">🏖️</div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ AI-Powered Packing Assistant</span>
          </div>
          <h1 className="hero-title">
            Never forget what to pack again
          </h1>
          <p className="hero-description">
            Add items to your bag, describe your trip, and get AI-powered recommendations 
            for everything else you need — organized by category and personalized for your journey.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Travelers</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Destinations</span>
            </div>
          </div>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">
              <span>Get Started Free</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/login" className="btn btn-secondary">
              <span>Already have an account?</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">Get personalized packing recommendations in just 3 simple steps</p>
        </div>
        
        <div className="steps-container">
          <div className="steps-timeline">
            <div className="step">
              <div className="step-visual">
                <div className="step-number">1</div>
                <div className="step-icon">📦</div>
              </div>
              <div className="step-content">
                <h3>Add items to your bag</h3>
                <p>Start by adding the items you already know you need to pack. Every item helps our AI understand your style.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-visual">
                <div className="step-number">2</div>
                <div className="step-icon">✍️</div>
              </div>
              <div className="step-content">
                <h3>Describe your trip</h3>
                <p>Tell us about your destination, activities, weather, and duration. The more details, the better our recommendations.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-visual">
                <div className="step-number">3</div>
                <div className="step-icon">🤖</div>
              </div>
              <div className="step-content">
                <h3>Get AI recommendations</h3>
                <p>Receive categorized suggestions based on your response, including commonly forgotten items and travel essentials.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">What makes us different</h2>
          <p className="section-subtitle">Powerful features designed to make packing effortless and comprehensive</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card feature-card-large">
            <div className="feature-icon">🧠</div>
            <h3>Smart AI Recommendations</h3>
            <p>Get personalized suggestions based on your specific trip details, activities, weather conditions, and personal preferences.</p>
            <div className="feature-highlight">Powered by Claude & Hugging Face</div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Organized Categories</h3>
            <p>Items are sorted into clear categories like toiletries, clothing, electronics, and essentials for easy reference.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Commonly Forgotten Items</h3>
            <p>We remind you of items people often forget like chargers, medications, travel documents, and adapters.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Save & Organize</h3>
            <p>Save your recommendations for future trips and organize them by destination or trip type.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Travel Ready</h3>
            <p>Works for any destination worldwide - from beach vacations to business trips to backpacking adventures.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Results</h3>
            <p>Get comprehensive packing lists in seconds, not hours of research and planning.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your trip details and personal information are kept secure and never shared with third parties.</p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof">
        <div className="section-header">
          <h2 className="section-title">Trusted by travelers worldwide</h2>
        </div>
        
        <div className="testimonials">
          <div className="testimonial">
            <div className="testimonial-content">
              "Finally, an app that actually remembers what I forget! Saved me from forgetting my phone charger on 3 trips."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👩</div>
              <div className="author-info">
                <div className="author-name">Sarah M.</div>
                <div className="author-role">Frequent Traveler</div>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="testimonial-content">
              "The AI recommendations are spot-on. It suggested items I never would have thought of for my hiking trip."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨</div>
              <div className="author-info">
                <div className="author-name">Mike R.</div>
                <div className="author-role">Adventure Seeker</div>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="testimonial-content">
              "Perfect for business travel. Never forget my laptop charger or presentation materials again!"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👩</div>
              <div className="author-info">
                <div className="author-name">Jennifer L.</div>
                <div className="author-role">Business Professional</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to pack smarter?</h2>
          <p>Join thousands of travelers who never forget essentials again. Start your stress-free packing journey today.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary btn-large">
              <span>Start Packing Now</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>
          <div className="cta-note">
            <span>✨ Free to use • No credit card required • Instant access</span>
          </div>
        </div>
      </section>
    </div>
  );
}