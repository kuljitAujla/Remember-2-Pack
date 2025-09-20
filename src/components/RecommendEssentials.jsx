export default function recommendedEssentials({ ref, getRecommendedItems }) {

  return (

    <div className="recommend-items-container">
      <div className="recommend-items-box">
          <div ref={ref}>
            <h3>Ready for packing suggestions?</h3>
            <p>Get personalized packing suggestions based on what you have already added to your bag.</p>
          </div>
          <button onClick={getRecommendedItems}>Recommend essentials</button>
    </div>
    </div>
    
  )
}