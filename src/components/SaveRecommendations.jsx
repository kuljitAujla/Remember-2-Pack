import React from 'react';

export default function SaveRecommendations({ title, setTitle, handleSave, saving, recommendedItems }) {
  return (
    <div className="save-recommendations-section">
      <div className="save-section-header">
        <h3>💾 Save Your Recommendations</h3>
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
          disabled={saving || !recommendedItems}
          className="save-btn"
        >
          {saving ? (
            <>
              <span className="loading-spinner"></span>
              Saving...
            </>
          ) : (
            <>
              💾 Save Recommendations
            </>
          )}
        </button>
      </div>
    </div>
  );
}
