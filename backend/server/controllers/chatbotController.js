import { Anthropic } from "@anthropic-ai/sdk";
import { generateRecommendations } from "./recommendController.js";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const HF_API_KEY = process.env.HF_API_KEY;

export const chatbotQuestionGenerator = async (req, res) => {

        const {packedItems, tripSummary, userMessage, chatbotHistory} = req.body;

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
        ${userMessage ? `Recent User Message: ${userMessage},` : ""}
        ${chatbotHistory ? `Your Chat History: ${chatbotHistory},` : ""}


        Question should be one to two sentences long, nothing too long or short.
        `

        if (!packedItems || !tripSummary) {
            return res.status(400).json({ error: "Missing required fields" });
          }


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
                    { role: "system", content: CHATBOT_PROMPT }
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
            return res.json({success: true, question: hfData.choices[0].message.content});
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
                    content: CHATBOT_PROMPT,
                  },
                ],
              });
        
              return res.json({success: true, question: msg.content[0].text});
            } catch (claudeErr) {
              console.error("Claude also failed:", claudeErr.message);
              return res.status(500).json({ error: "Both HF and Claude failed" });
            }
        }
}

export async function getChatbotInstruction({ chatbotHistory, aiRecommendations, packedItems, tripSummary}) {
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
  
    try {
      console.log("Calling Hugging Face API...");
      const hfResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: [{ role: "system", content: AI_PROMPT }],
          max_tokens: 1024,
        }),
      });
  
      if (!hfResponse.ok) throw new Error("HF request failed");
  
      const hfData = await hfResponse.json();
      const instruction = hfData?.choices?.[0]?.message?.content?.trim();
      if (instruction) return instruction;
  
      throw new Error("Empty instruction from HF");
    } catch (hfErr) {
      console.error("HF failed:", hfErr.message);
  
      try {
        console.log("Falling back to Claude API...");
        const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  
        const msg = await anthropic.messages.create({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 512,
          messages: [{ role: "user", content: AI_PROMPT }],
        });
  
        return msg?.content?.[0]?.text?.trim() || "Error: No instruction returned";
      } catch (claudeErr) {
        console.error("Claude also failed:", claudeErr.message);
        throw new Error("Both HF and Claude failed");
      }
    }
  }

export const refinedRecommendations = async (req, res) => {
    const {packedItems, tripSummary, chatbotHistory, aiRecommendations} = req.body;

    try {
        const chatbotInstruction = await getChatbotInstruction({ chatbotHistory, aiRecommendations, tripSummary, packedItems });
        const newRecMarkdown = await generateRecommendations(packedItems, tripSummary, chatbotInstruction, aiRecommendations)


        return res.json({
            success: true,
            refinedRecommendations: newRecMarkdown,
          });
    } catch (err) {
        console.error("Error refining recommendations:", err);
        return res.status(500).json({
            success: false,
            error: err.message || "Failed to refine recommendations",
        });
    }
}