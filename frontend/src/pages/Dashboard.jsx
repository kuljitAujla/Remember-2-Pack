import React from "react"
import Header from '../components/Header';
import PackedList from "../components/PackedList"
import SaveRecommendations from "../components/SaveRecommendations"
import Chatbot from "../components/chatbot"
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
  const itemInputRef = React.useRef(null)

  React.useEffect(() => {
    if (recommendedItems !== "" && recommendedEssentials !== null) {
      recommendedEssentials.current.scrollIntoView({behavior: "smooth"})
    }
  }, [recommendedItems])

  function addItem(formData) {
    const newItem = formData.get("item")
    setItems(prevItem => [...prevItem, newItem])
    
    // Keep focus on input to maintain keyboard on mobile
    setTimeout(() => {
      if (itemInputRef.current) {
        itemInputRef.current.focus()
      }
    }, 0)
  }

  async function getRecommendedItems() {
    setLoadingRecommendations(true)
    try {
      const tripDetails = tripDetailsRef.current.value
      const generatedRecommendationMarkdown = await getRecommendationsFromAI(items, tripDetails)
      setRecommendedItems(generatedRecommendationMarkdown)
      setTripSummary(tripDetails)
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations/save`, {
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
              ref={itemInputRef}
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
            <SaveRecommendations 
            title={title}
            setTitle={setTitle}
            handleSave={handleSave}
            saving={saving}
            recommendedItems={recommendedItems}
            />
            
            {/* Recommendations and Chatbot Side-by-Side */}
            <div className="recommendations-chatbot-wrapper">
              <div className="recommendations-content">
                <h2>Remember 2 Pack: </h2>
                <ReactMarkdown>{recommendedItems}</ReactMarkdown>
              </div>

              <div className="chatbot-section">
                <Chatbot 
                  packedItems={items}
                  tripSummary={tripSummary}
                  aiRecommendations={recommendedItems}
                  onUpdateRecommendations={setRecommendedItems}
                />
              </div>
            </div>

            <SaveRecommendations 
            title={title}
            setTitle={setTitle}
            handleSave={handleSave}
            saving={saving}
            recommendedItems={recommendedItems}
            />
          </section>
        )}
      </main>
    </>
  );
}
