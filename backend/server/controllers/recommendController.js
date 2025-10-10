/* global process */
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

  const HF_API_KEY = process.env.HF_API_KEY;
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;


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

export const generateRecommendations = async (packedItems, tripSummary, instructions ='', previousResponse='') => {

  const INPUT_PROMPT = `
  User: I have ${packedItems}. Trip details are: ${tripSummary}.
  Please assist with my packing by recommending what to bring.
  `;

  const INSTRUCTION = `
  You have already given me a response of ${previousResponse} which is good. However, I have additional instructions as the items needed more refinement.
  Please keep the markdown and content the same, but implement these instructions: ${instructions}
  `

  try {
    console.log("hf api");
    const hfResponse = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `${INPUT_PROMPT} ${instructions ? INSTRUCTION : ''}` },
          ],
          max_tokens: 2048,
        }),
      }
    );

    if (!hfResponse.ok) {
      throw new Error("HF request failed");
    }

    const hfData = await hfResponse.json();
    console.log(hfData)
    return hfData
  } catch (err) {
    console.error("HF failed, falling back to CLAUDE:", err.message);

    try {
      console.log("claude api");

      const anthropic = new Anthropic({
        apiKey: ANTHROPIC_API_KEY,
      });

      const msg = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You, the ai are ${SYSTEM_PROMPT}, thus ensure to act like it and give welcome like messages. ${INPUT_PROMPT} ${instructions ? INSTRUCTION : ''}`,
          },
        ],
      });

      return msg;
    } catch (claudeErr) {
      console.error("Claude also failed:", claudeErr.message);
      throw new Error("Both have failed")
    }
  }
};

export const recommendController = async (req, res) => {

  const { packedItems, tripSummary } = req.body;
  
  try {
    const msg = await generateRecommendations(packedItems, tripSummary);
    return res.json(msg)
  } catch (error) {
    return res.status(500).json({ error: error.message})
  }
  
};
