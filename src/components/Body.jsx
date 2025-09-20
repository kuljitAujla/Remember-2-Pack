import React from "react"
import RecommendItems from "./RecommededItems"
import PackedList from "./PackedList"
import RecommendedEssentials from "./RecommendEssentials"
import { getRecommendationsFromAI } from "../ai"

export default function Body() {

  const [items, setItems] = React.useState([])
  const [recommendedItems, setRecommendedItems] = React.useState("")

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
    const generatedRecommendationMarkdown = await getRecommendationsFromAI(items, tripDetailsRef.current.value)
    setRecommendedItems(generatedRecommendationMarkdown)
    tripDetailsRef.current.value = ""
  }

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
      
      <RecommendedEssentials ref={recommendedEssentials} getRecommendedItems={getRecommendedItems}/>
      
      
      {recommendedItems && <RecommendItems AiGeneratedRecommendations={recommendedItems} />}

    </main>
  )
}