import { Anthropic } from "@anthropic-ai/sdk";
import dotenv from "dotenv";




dotenv.config();
const HF_API_KEY = process.env.HF_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export const AI_CONFIG = {
  HF_MODEL: "meta-llama/Llama-3.1-8B-Instruct",
  CLAUDE_MODEL: "claude-haiku-4-5-20251001",
  HF_ENDPOINT: "https://router.huggingface.co/v1/chat/completions",
  MAX_TOKENS: {
    BRIEF: 512,
    STANDARD: 1024,
    EXTENDED: 2048,
  }
};

/**
 * Calls AI with HuggingFace fallback to Claude
 * prompt - The prompt to send to the AI
 * options - Configuration options
options.maxTokens - Maximum tokens for response
 */
export async function callAI(prompt, options = {}) {
  const {
    maxTokens = AI_CONFIG.MAX_TOKENS.STANDARD
  } = options;

  // Try HuggingFace first
  try {
    console.log("Calling HuggingFace API...");
    const hfResponse = await fetch(AI_CONFIG.HF_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: AI_CONFIG.HF_MODEL,
        messages: [{ role: "system", content: prompt }],
        max_tokens: maxTokens,
      }),
    });

    if (!hfResponse.ok) {
      throw new Error(`HF request failed with status: ${hfResponse.status}`);
    }

    const hfData = await hfResponse.json();
    return hfData.choices[0].message.content.trim();

  } catch (hfErr) {
    console.error("HF failed, falling back to Claude:", hfErr.message);

    // Fallback to Claude
    try {
      console.log("Calling Claude API...");
      const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

      const msg = await anthropic.messages.create({
        model: AI_CONFIG.CLAUDE_MODEL,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      });

      return msg.content[0].text.trim();

    } catch (claudeErr) {
      console.error("Claude also failed:", claudeErr.message);
      throw new Error("Both AI providers (HuggingFace and Claude) failed");
    }
  }
}

