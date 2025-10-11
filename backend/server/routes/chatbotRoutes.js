import express from "express";
import { chatbotQuestionGenerator, refinedRecommendations } from "../controllers/chatbotController.js";

const chatbotRouter = express.Router();

// Save a new recommendation
chatbotRouter.post("/generate-question", chatbotQuestionGenerator);
chatbotRouter.post("/refined-recommendation", refinedRecommendations);

export default chatbotRouter;