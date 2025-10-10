// Frontend helper for talking to your backend API

export async function getRecommendationsFromAI(packedItems, tripSummary) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', // Important for sending authentication cookies
      body: JSON.stringify({ packedItems, tripSummary })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("API request failed:", errorData);
      throw new Error(errorData.error || "API request failed");
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to generate recommendations");
    }

    // Backend now returns clean { success: true, recommendations: "string" }
    return data.recommendations || "No response";

  } catch (err) {
    console.error("Frontend API call failed:", err.message);
    return "Sorry, could not generate recommendations.";
  }
}
