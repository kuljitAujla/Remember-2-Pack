import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landingPage.css';
import Header from '../components/Header';

export default function Landing() {
  return (
    <div className="landing-page">
      <Header />

      {/* ---- Hero ---- */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <h1 className="hero-title">
            Pack smarter,<br />travel lighter
          </h1>
          <p className="hero-desc">
            Tell us about your trip and what you've packed. Our AI fills in
            everything you're forgetting — organized, personalized, and instant.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get started — it's free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Sign in
            </Link>
          </div>
          <div className="hero-proof">
            <div className="proof-item">
              <span className="proof-number">20+</span>
              <span className="proof-label">min saved per trip</span>
            </div>
            <div className="proof-divider" />
            <div className="proof-item">
              <span className="proof-number">100%</span>
              <span className="proof-label">data encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section className="steps-section">
        <div className="section-container">
          <p className="section-label">How it works</p>
          <h2 className="section-heading">Three steps to a perfect packing list</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3>Add your items</h3>
              <p>List what you already know you need — or snap a photo and let AI detect items automatically.</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h3>Describe your trip</h3>
              <p>Where you're going, how long, what you'll do. The more detail, the better the suggestions.</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h3>Get recommendations</h3>
              <p>Receive a categorized list of everything else you need — including items people commonly forget.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="features-section">
        <div className="section-container">
          <p className="section-label">What you get</p>
          <h2 className="section-heading">Everything you need to pack with confidence</h2>

          <div className="features-list">
            <div className="feature-row">
              <div className="feature-dot feature-dot--blue" />
              <div>
                <h3>Smart suggestions</h3>
                <p>Personalized recommendations based on your destination, activities, weather, and trip length.</p>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-dot feature-dot--violet" />
              <div>
                <h3>Organized by category</h3>
                <p>Items automatically sorted into toiletries, clothing, electronics, documents, and more.</p>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-dot feature-dot--amber" />
              <div>
                <h3>Catches what you miss</h3>
                <p>Chargers, medications, adapters, travel docs — the stuff people always forget.</p>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-dot feature-dot--emerald" />
              <div>
                <h3>Save for later</h3>
                <p>Keep your lists for future trips. No need to start from scratch every time.</p>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-dot feature-dot--blue" />
              <div>
                <h3>Follow-up chat</h3>
                <p>Ask questions, get specific advice, and refine your list in a conversation.</p>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-dot feature-dot--violet" />
              <div>
                <h3>Private by default</h3>
                <p>Your data stays yours. Encrypted in transit and at rest, never sold.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to pack without the stress?</h2>
          <p>Join travelers who never forget essentials. Start in seconds.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Start packing now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">Remember 2 Pack</p>
          <p className="footer-copy">Built for travelers who'd rather explore than worry about what they forgot.</p>
        </div>
      </footer>
    </div>
  );
}