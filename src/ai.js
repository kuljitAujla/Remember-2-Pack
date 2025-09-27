// Frontend helper for talking to your backend API

export async function getRecommendationsFromAI(packedItems, tripSummary) {
  try {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Important for cookies
      body: JSON.stringify({ packedItems, tripSummary })
    });

    if (!res.ok) throw new Error("API request failed");

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
