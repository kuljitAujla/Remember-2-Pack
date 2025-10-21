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
  const [saved, setSaved] = React.useState(false)
  const [loadingRecommendations, setLoadingRecommendations] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState(null)
  const [tempImageKey, setTempImageKey] = React.useState(null)
  const [uploadingImage, setUploadingImage] = React.useState(false)

  const recommendedEssentials = React.useRef(null)
  const tripDetailsRef = React.useRef(null)
  const itemInputRef = React.useRef(null)
  const fileInputRef = React.useRef(null)

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

  function handleImageClick() {
    fileInputRef.current?.click()
  }

  async function handleImageSelect(event) {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    setSelectedImage(file)
    setUploadingImage(true)

    try {
      // Upload to S3 temp folder and get detected items
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/image/upload-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      
      // Store temp key for later confirmation or deletion
      setTempImageKey(data.key)

      // Add detected items to the packed list
      if (data.detectedItems && data.detectedItems.length > 0) {
        const itemNames = data.detectedItems.map(item => item.name)
        setItems(prevItems => [...prevItems, ...itemNames])
      }


    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload and analyze image. Please try again.')
      setSelectedImage(null)
    } finally {
      setUploadingImage(false)
    }
  }

  async function getRecommendedItems() {
    const tripDetails = tripDetailsRef.current.value.trim()
    
    // Check if trip details are provided
    if (!tripDetails) {
      alert('Please describe your trip details before generating recommendations.')
      return
    }
    
    setLoadingRecommendations(true)
    setSaved(false) // Reset saved state when generating new recommendations
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
    let imageKey = null;
    
    try {

      // If image was uploaded to temp, moves it to permanent storage
      if (tempImageKey) {
        const confirmResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/image/confirm-upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            tempKey: tempImageKey
            // userId is obtained from auth token by backend
          })
        });
        
        if (confirmResponse.ok) {
          const confirmData = await confirmResponse.json();
          imageKey = confirmData.newKey;
        } else {
          const errorData = await confirmResponse.json();
        }
      }
      
      // Save the recommendation
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
          aiRecommendations: recommendedItems,
          imageKey: imageKey // Include the S3 key if image was uploaded
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save recommendation');
      }
      
      // Set saved state and stop showing loading spinner
      setSaving(false);
      setSaved(true);
      
      // Reset image states after successful save
      setTempImageKey(null);
      setSelectedImage(null);
    } catch (error) {
      console.error('Save failed:', error);
      setSaving(false); // Re-enable on error
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
            <button 
              type="button" 
              className="image-attach-btn"
              onClick={handleImageClick}
              disabled={uploadingImage}
              aria-label="Attach image"
              title="Attach image"
            >
              {uploadingImage ? 'Uploading...' : 'Image'}
            </button>
            <input 
              type="file"
              name="image"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              style={{ display: 'none' }}
              aria-label="Upload image file"
            />
            <input 
              ref={itemInputRef}
              aria-label="add packed item" 
              type="text" 
              placeholder="e.g. charger"
              name="item"/>
            <button>Add to Bag</button>
          </form>
          {uploadingImage && (
            <small className="image-selected-info">
              🔄 Analyzing image with AI...
            </small>
          )}
          {selectedImage && !uploadingImage && (
            <small className="image-selected-info">
              ✅ Image analyzed: {selectedImage.name} - Items automatically added to your list!
            </small>
          )}
        </div>

        <PackedList listOfItems = {items} />
        
        <div className="purpose-container">
          <label className="purpose-label">Describe your trip so AI can suggest better items *</label>
          <small className="purpose-info">Add details like location, length of stay, and activities for better recommendations.</small>
          <textarea 
            ref={tripDetailsRef} 
            placeholder="e.g. I'm moving into a university dorm for 8 months with a small kitchen but no stove, so I'll need ideas for long-term essentials. Or: I'm going to Atlanta for a week for a wedding, and I might also go sightseeing and shopping at malls during the trip." 
            className="purpose-text"
          ></textarea>
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
            saved={saved}
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
            saved={saved}
            recommendedItems={recommendedItems}
            />
          </section>
        )}
      </main>
    </>
  );
}
