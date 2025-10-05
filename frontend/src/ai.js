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
      throw new Error(errorData.message || "API request failed");
    }

    const data = await res.json();

    // Normalize Hugging Face vs Claude response
    if (data.choices) {
      // Hugging Face (OpenAI-style response)
      return data.choices[0]?.message?.content || "No response";
    } else if (data.content) {
      // Claude response
      return data.content[0]?.text || "No response";
    } else {
      return data.text || "No response";
    }
  } catch (err) {
    console.error("Frontend API call failed:", err.message);
    return "Sorry, could not generate recommendations.";
  }
}
