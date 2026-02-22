import React from 'react';
import { Link } from 'react-router-dom';

export default function SaveRecommendations({ title, setTitle, handleSave, saving, saved, recommendedItems }) {
  return (
    <div className="save-recommendations-section">
      <div className="save-section-header">
        <h3>Save Your Recommendations</h3>
        <p>Give your trip a name and save these recommendations for later!</p>
      </div>
      <div className="save-section">
        <div className="trip-name-group">
          <label htmlFor="trip-title" className="trip-name-label">Trip Name:</label>
          <input
            id="trip-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Business Trip to NYC..."
            className="trip-title-input"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved || !recommendedItems}
          className={`save-btn ${saved ? 'saved' : ''}`}
        >
          {saving ? (
            <>
              <span className="loading-spinner"></span>
              Saving...
            </>
          ) : saved ? (
            'Saved'
          ) : (
            'Save Recommendations'
          )}
        </button>
      </div>
      {saved && (
        <div className="save-success-msg">
          <p>Recommendations saved successfully!</p>
          <Link to="/saved" className="view-saved-link">View saved trips</Link>
          <span className="save-hint">or use the menu in the top right</span>
        </div>
      )}
    </div>
  );
}
