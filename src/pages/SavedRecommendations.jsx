import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import '../styles/savedRecommendations.css';

export default function SavedRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recommendations', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullRecommendation = async (id) => {
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendation details');
      }
      
      const data = await response.json();
      setSelectedRecommendation(data.recommendation);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteRecommendation = async (id) => {
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete recommendation');
      }
      
      // Remove from local state
      setRecommendations(prev => prev.filter(rec => rec._id !== id));
      if (selectedRecommendation && selectedRecommendation._id === id) {
        setSelectedRecommendation(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="saved-recommendations-page">
        <div className="page-header">
          <Link to="/app" className="back-btn">← Back to Dashboard</Link>
          <h1>Saved Recommendations</h1>
        </div>
        <div className="loading">Loading your saved recommendations...</div>
      </div>
    );
  }

  return (
    <div className="saved-recommendations-page">
      <div className="page-header">
        <Link to="/app" className="back-btn">← Back to Dashboard</Link>
        <h1>Saved Recommendations</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="recommendations-container">
        <div className="recommendations-list">
          {recommendations.length === 0 ? (
            <div className="no-recommendations">
              <h3>No saved recommendations yet</h3>
              <p>Start by generating some AI recommendations and saving them!</p>
              <Link to="/app" className="btn-primary">Go to Dashboard</Link>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div 
                key={rec._id} 
                className={`recommendation-item ${selectedRecommendation?._id === rec._id ? 'active' : ''}`}
                onClick={() => fetchFullRecommendation(rec._id)}
              >
                <div className="recommendation-preview">
                  <h3>{rec.title}</h3>
                  <p className="trip-summary">{rec.tripSummary}</p>
                  <p className="packed-count">{rec.packedItems.length} items packed</p>
                  <p className="created-date">
                    {new Date(rec.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRecommendation(rec._id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
        
        {selectedRecommendation && (
          <div className="recommendation-details">
            <div className="details-header">
              <h2>{selectedRecommendation.title}</h2>
            </div>
            
            <div className="trip-info">
              <h3>Trip Details:</h3>
              <p>{selectedRecommendation.tripSummary}</p>
            </div>
            
            <div className="packed-items">
              <h3>Items You Packed:</h3>
              <ul>
                {selectedRecommendation.packedItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="ai-recommendations">
              <h3>AI Recommendations:</h3>
              <ReactMarkdown>{selectedRecommendation.aiRecommendations}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
