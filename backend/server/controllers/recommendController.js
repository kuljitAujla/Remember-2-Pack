/* global process */
import dotenv from "dotenv";
import { callAI, AI_CONFIG } from "../services/aiService.js";

dotenv.config();

const SYSTEM_PROMPT = `
You are an assistant that receives a list of items a user has already packed and suggests what other items they should pack. 

- Do not repeat items that are already packed.
- If trip details (destination, length of stay, activities, weather, etc.) are provided, use them to make context-specific suggestions.
- Group your suggestions into clear categories (e.g., Essentials, Toiletries, Clothing, Electronics, Documents, Miscellaneous) and add more if you think there must be more for the specific user case.
- Per section you are encouraged to include all possible items that may be needed so do not feel the need to keep the list short by any means. 
- Always highlight commonly forgotten items in a dedicated section. Ensure there is a commonly forgotton section. 
- ALWAYS format your response in markdown with headings, bullet points and emojis, and bolding to make it easy to render on a web page.
- ALWAYS have bulletpoints under each section.
`;

export const generateRecommendations = async (packedItems, tripSummary, instructions = '', previousResponse = '') => {
  // If instructions explicitly say no changes needed, return previous response as-is
  if (instructions && instructions.toLowerCase().includes('no changes needed')) {
    return previousResponse;
  }

  const INPUT_PROMPT = `
  User: I have ${packedItems}. Trip details are: ${tripSummary}.
  Please assist with my packing by recommending what to bring.
  `;

  const INSTRUCTION = instructions ? `
  You have already given me a response of ${previousResponse} which is good. However, I have additional instructions as the items needed more refinement.
  Please keep the same markdown structure and formatting, but implement these instructions: ${instructions}
  Make sure to integrate the changes naturally into the existing categories. Don't duplicate content.
  ` : '';

  const fullPrompt = `${SYSTEM_PROMPT}\n\n${INPUT_PROMPT}${INSTRUCTION}`;

  return await callAI(fullPrompt, { 
    maxTokens: AI_CONFIG.MAX_TOKENS.EXTENDED 
  });
};

export const recommendController = async (req, res) => {
  const { packedItems, tripSummary } = req.body;
  
  // Validate required fields exist
  if (!packedItems || !tripSummary) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing required fields: packedItems and tripSummary" 
    });
  }

  // Validate tripSummary is a string
  if (typeof tripSummary !== 'string' || tripSummary.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: "tripSummary must be a non-empty string" 
    });
  }

  // Convert packedItems to string if it's an array
  let packedItemsString;
  if (Array.isArray(packedItems)) {
    packedItemsString = packedItems.join(', ');
  } else if (typeof packedItems === 'string') {
    packedItemsString = packedItems;
  } else {
    return res.status(400).json({ 
      success: false, 
      error: "packedItems must be a string or array" 
    });
  }

  // Check if packedItemsString is not empty
  if (packedItemsString.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: "packedItems cannot be empty" 
    });
  }

  try {
    const recommendations = await generateRecommendations(packedItemsString, tripSummary);
    return res.json({ 
      success: true, 
      recommendations 
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
