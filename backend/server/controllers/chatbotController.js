import { callAI, AI_CONFIG } from "../services/aiService.js";
import { generateRecommendations } from "./recommendController.js";

export const chatbotQuestionGenerator = async (req, res) => {
  const { packedItems, tripSummary, chatbotHistory, aiRecommendations } = req.body;

  if (!packedItems || !tripSummary) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing required fields" 
    });
  }

  const CHATBOT_PROMPT = `
You are an intelligent packing refinement assistant for the "Remember-2-Pack" app.

Your task:
1. Review the user's current packed items and trip summary.
2. Think briefly about what *might be missing* based on the type, duration, and purpose of their trip. 
(Consider weather, leisure time, formal events, business needs, hygiene, electronics, cultural context, etc.)
3. Based on this reasoning, ask ONE short, specific, and natural follow-up question 
that helps fill a meaningful gap in their packing list.
4. Never repeat a previous question. Use short-term memory from this conversation only.
5. If there are no obvious gaps, do not push the user with questions, just respond with: 
"Chatbot: Your packing list seems complete. You can start packing."

Always start your output with "Chatbot: ".

Context:
Packed Items: ${packedItems}
Trip Summary: ${tripSummary}
${chatbotHistory ? `Your Chat History: ${chatbotHistory}` : ""}

Question should be one to two sentences long, nothing too long or short.
`;

  try {
    const question = await callAI(CHATBOT_PROMPT, { 
      maxTokens: AI_CONFIG.MAX_TOKENS.STANDARD 
    });

    return res.json({ success: true, question });
  } catch (error) {
    console.error("Error generating chatbot question:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export async function getChatbotInstruction({ 
  chatbotHistory, 
  aiRecommendations, 
  packedItems, 
  tripSummary 
}) {
  if (!packedItems || !tripSummary) {
    throw new Error("Missing required fields: packedItems or tripSummary");
  }

  const AI_PROMPT = `
You are the assistant responsible for communicating user updates to the recommendation AI 
that generated their packing list.

Your task:
1. Review the conversation history between the user and the chatbot:
${chatbotHistory}

2. The original AI recommendation (in markdown format) was:
${aiRecommendations}

3. Here is the current user context:
- Packed Items: ${packedItems}
- Trip Summary: ${tripSummary}

Your goal:
- Interpret what *new intent or change* the user expressed in their latest message.
- Summarize that intent in clear, actionable instructions directed at the recommendation AI.
- Be explicit about what needs to change in the packing list (add, remove, or modify items).
- Avoid rephrasing the conversation or chatting — respond *as if you were giving instructions to another AI system*.

Respond in this format:
"Instruction to Recommendation AI: [concise, direct description of the change]"

Examples:
- Instruction to Recommendation AI: Add casual clothes and sneakers for a leisure day in New York.
- Instruction to Recommendation AI: Include an umbrella and waterproof shoes due to expected rain.
- Instruction to Recommendation AI: No changes needed — user confirmed list is complete.
`;

  return await callAI(AI_PROMPT, { 
    maxTokens: AI_CONFIG.MAX_TOKENS.STANDARD 
  });
}

export const refinedRecommendations = async (req, res) => {
  const { packedItems, tripSummary, chatbotHistory, aiRecommendations } = req.body;

  if (!packedItems || !tripSummary || !chatbotHistory || !aiRecommendations) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing required fields" 
    });
  }

  try {
    const chatbotInstruction = await getChatbotInstruction({ 
      chatbotHistory, 
      aiRecommendations, 
      tripSummary, 
      packedItems 
    });

    const refinedMarkdown = await generateRecommendations(
      packedItems, 
      tripSummary, 
      chatbotInstruction, 
      aiRecommendations
    );

    return res.json({
      success: true,
      refinedRecommendations: refinedMarkdown,
    });
  } catch (err) {
    console.error("Error refining recommendations:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to refine recommendations",
    });
  }
};