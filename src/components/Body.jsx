import React from "react"
import PackedList from "./PackedList"
import ReactMarkdown from "react-markdown"
import { getRecommendationsFromAI } from "../ai"
import "../styles/dashboard.css"

export default function Body() {

  const [items, setItems] = React.useState([])
  const [recommendedItems, setRecommendedItems] = React.useState("")
  const [tripSummary, setTripSummary] = React.useState("")
  const [title, setTitle] = React.useState("My Trip")
  const [saving, setSaving] = React.useState(false)

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
    const tripDetails = tripDetailsRef.current.value
    const generatedRecommendationMarkdown = await getRecommendationsFromAI(items, tripDetails)
    setRecommendedItems(generatedRecommendationMarkdown)
    setTripSummary(tripDetails)
    tripDetailsRef.current.value = ""
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
    <main>

      <form action={addItem} className="add-item-form">
        <div></div>
        <input 
        aria-label="add packed item" 
        type="text" 
        placeholder="e.g. charger"
        name="item"/>
        <button>Add to Bag</button>
      </form>

      
      

      <PackedList listOfItems = {items} />
      <div className="purpose-container">
        <label className="purpose-label">Describe your trip so AI can suggest better items</label>
        <small className="purpose-info">Add details like location, length of stay, and activities for better recommendations.</small>
        <textarea ref={tripDetailsRef} placeholder="e.g. I’m moving into a university dorm for 8 months with a small kitchen but no stove, so I’ll need ideas for long-term essentials. Or: I’m going to Atlanta for a week for a wedding, and I might also go sightseeing and shopping at malls during the trip." className="purpose-text"></textarea>
      </div>
      
      {/* Recommend Essentials Section */}
      <div className="recommend-items-container">
        <div className="recommend-items-box">
          <div ref={recommendedEssentials}>
            <h3>Ready for packing suggestions?</h3>
            <p>Get personalized packing suggestions based on what you have already added to your bag.</p>
          </div>
          <button onClick={getRecommendedItems}>Recommend essentials</button>
        </div>
      </div>
      
      {/* AI Recommendations Section */}
      {recommendedItems && (
        <section className="suggested-recipe-container">
          <div className="recommendations-header">
            <h2>Remember 2 Pack: </h2>
            <div className="save-section">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your trip a name..."
                className="trip-title-input"
              />
              <button 
                onClick={handleSave}
                disabled={saving || !recommendedItems}
                className="save-btn"
              >
                {saving ? "Saving..." : "Save Recommendations"}
              </button>
            </div>
          </div>
          <ReactMarkdown>{recommendedItems}</ReactMarkdown>
        </section>
      )}


    </main>
  )
}