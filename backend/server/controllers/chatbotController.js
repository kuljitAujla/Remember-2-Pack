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

  // Convert packedItems to string if it's an array
  const packedItemsString = Array.isArray(packedItems) 
    ? packedItems.join(', ') 
    : packedItems;

  const CHATBOT_PROMPT = `
You are an intelligent packing refinement assistant for the "Remember-2-Pack" app.

Your task:
1. Review the user's trip summary, and the AI recommended items (imagine as if user has already packed these).
2. Think briefly about what question you can ask based on the type, duration, and purpose of their trip from the recommended packed items to add additional items based on the response. 
(Consider weather, leisure time, formal events, business needs, hygiene, cultural context, etc.)
3. Based on this reasoning, ask ONE short, specific, and natural follow-up question 
that helps fill a meaningful gap in their packing list.
${!chatbotHistory ? `3.5. If user asks you to add or remove something then do not ask a question but say that you have either added it or removed it` : ''}
4. Never repeat a previous question. Use the chat history to track what you've already asked about.
5. If the user declined your previous suggestion, move on to a COMPLETELY DIFFERENT category - don't keep asking about the same topic.
6. If you've covered most categories or the user indicates/implies they don't need more, respond with: 
"Chatbot: Your packing list looks great! You're all set to start packing." You usually miss this and keep asking questions when user is done so make sure you pay attention to users last message.

Always start your output with "Chatbot: ".

Context:
${!chatbotHistory ? `Initial Packed Items: ${packedItemsString}` : ''}
Trip Summary: ${tripSummary}
AI Recommended items which assume are items user has packed (ignore the markdown formatting): ${aiRecommendations}
${chatbotHistory ? `
Chat History (where you are "Chatbot"): ${chatbotHistory}

Important Instructions:
- If the user's LAST message was affirmative ("yes", "sure", "okay", etc.), acknowledge it naturally (e.g., "Great! I've noted that."). 
- If the user's LAST message was negative ("no", "not needed", "don't need"), respect it and move to a DIFFERENT topic or conclude
- Always make sure you respond to the last message and then add the question/response (if users last message implies list is finished then do not add question/response)
- NEVER ask the same type of question twice
- Move onto the next topic after items had been added. (do not stay persistent with the same topic, actively try to change topics)
- Review the full chat history to see what topics you've already covered
- MAKE SURE If user implies that they already packed everything, reply with something like "Happy to help, just let me know if you'd like to make any changes!"
` : ""}

Keep your response to one to two sentences maximum.
`;

console.log(chatbotHistory)
console.log(aiRecommendations)

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
}) {
  if (!packedItems) {
    throw new Error("Missing required fields: packedItems");
  }

  const AI_PROMPT = `
You are the assistant responsible for communicating user updates to the recommendation AI 
that generated their packing list.

Your task:
1. Review the conversation history between the user and the chatbot:
${chatbotHistory}

2. The original AI recommendation (in markdown format) was:
${aiRecommendations}

${!chatbotHistory ? `3. Here is the items user initially packed (make sure these are added in ai recommendations):
- Packed Items: ${packedItems}` : ''}


Your goal:
- Look at the LATEST user response in the chat history
- If the user agreed to add something ("yes", "sure", "okay", etc.) or requested something specific, provide instructions to add those items
- If the user declined ("no", "I don't need", "not needed", etc.), respond with: "Instruction to Recommendation AI: No changes needed."
- Be explicit about what needs to change in the packing list (add, remove, or modify items)
- Avoid rephrasing the conversation or chatting — respond *as if you were giving instructions to another AI system*

Respond in this format:
"Instruction to Recommendation AI: [concise, direct description of the change]"

Examples:
- Instruction to Recommendation AI: Add power adapters and extension cord for electronics.
- Instruction to Recommendation AI: Include an umbrella and waterproof shoes due to expected rain.
- Instruction to Recommendation AI: No changes needed.
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

  // Convert packedItems to string if it's an array
  const packedItemsString = Array.isArray(packedItems) 
    ? packedItems.join(', ') 
    : packedItems;

  try {
    const chatbotInstruction = await getChatbotInstruction({ 
      chatbotHistory, 
      aiRecommendations, 
      packedItems: packedItemsString 
    });

    const refinedMarkdown = await generateRecommendations(
      packedItemsString, 
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