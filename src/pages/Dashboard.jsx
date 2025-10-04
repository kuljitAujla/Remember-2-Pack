import React from "react"
import Header from '../components/Header';
import PackedList from "../components/PackedList"
import ReactMarkdown from "react-markdown"
import { getRecommendationsFromAI } from "../ai"
import "../styles/dashboard.css"

export default function Dashboard() {
  const [items, setItems] = React.useState([])
  const [recommendedItems, setRecommendedItems] = React.useState("")
  const [tripSummary, setTripSummary] = React.useState("")
  const [title, setTitle] = React.useState("My Trip")
  const [saving, setSaving] = React.useState(false)
  const [loadingRecommendations, setLoadingRecommendations] = React.useState(false)

  const recommendedEssentials = React.useRef(null)
  const tripDetailsRef = React.useRef(null)

  React.useEffect(() => {
    if (recommendedItems !== "" && recommendedEssentials !== null) {
      recommendedEssentials.current.scrollIntoView({behavior: "smooth"})
    }
  }, [recommendedItems])

  function addItem(formData) {
    const newItem = formData.get("item")
    setItems(prevItem => [...prevItem, newItem])
  }

  async function getRecommendedItems() {
    setLoadingRecommendations(true)
    try {
      const tripDetails = tripDetailsRef.current.value
      const generatedRecommendationMarkdown = await getRecommendationsFromAI(items, tripDetails)
      setRecommendedItems(generatedRecommendationMarkdown)
      setTripSummary(tripDetails)
      tripDetailsRef.current.value = ""
    } catch (error) {
      console.error('Failed to get recommendations:', error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const handleSave = async () => {
    if (!recommendedItems) return;
    
    setSaving(true);
    
    try {
      const response = await fetch('/api/recommendations/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: title,
          packedItems: items,
          tripSummary: tripSummary,
          aiRecommendations: recommendedItems
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save recommendation');
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="purpose-container">
          <label className="purpose-label">Add items that you have already packed</label>
          <small className="purpose-info">For the best recommendations, add as many items you know you need to pack.</small>
          <form action={addItem} className="add-item-form">
            <input 
              aria-label="add packed item" 
              type="text" 
              placeholder="e.g. charger"
              name="item"/>
            <button>Add to Bag</button>
          </form>
        </div>

        <PackedList listOfItems = {items} />
        
        <div className="purpose-container">
          <label className="purpose-label">Describe your trip so AI can suggest better items</label>
          <small className="purpose-info">Add details like location, length of stay, and activities for better recommendations.</small>
          <textarea ref={tripDetailsRef} placeholder="e.g. I'm moving into a university dorm for 8 months with a small kitchen but no stove, so I'll need ideas for long-term essentials. Or: I'm going to Atlanta for a week for a wedding, and I might also go sightseeing and shopping at malls during the trip." className="purpose-text"></textarea>
        </div>
        
        {/* Recommend Essentials Section */}
        <div className="recommend-items-container">
          <div className="recommend-items-box">
            <div ref={recommendedEssentials}>
              <h3>✨ Get Your AI Recommendations</h3>
              <p>Click below to generate personalized packing suggestions based on your trip details and packed items.</p>
            </div>
            <button 
              onClick={getRecommendedItems}
              disabled={loadingRecommendations}
              className={loadingRecommendations ? "loading" : ""}
            >
              {loadingRecommendations ? (
                <>
                  <span className="loading-spinner"></span>
                  Getting recommendations...
                </>
              ) : (
                <>
                  Generate<br />
                  Recommendations
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* AI Recommendations Section */}
        {recommendedItems && (
          <section className="suggested-recipe-container">
            {/* Save Section - Made more prominent */}
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
                    placeholder="e.g., Summer Vacation 2024, Business Trip to NYC..."
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
            
            <div className="recommendations-content">
              <h2>Remember 2 Pack: </h2>
              <ReactMarkdown>{recommendedItems}</ReactMarkdown>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
