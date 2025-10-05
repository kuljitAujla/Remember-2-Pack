import express from "express";
import { saveRecommendation, getUserRecommendations, getRecommendationById, deleteRecommendation } from "../controllers/recommendationController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// All routes require authentication
router.use(userAuth);

// Save a new recommendation
router.post("/save", saveRecommendation);

// Get all recommendations for the authenticated user
router.get("/", getUserRecommendations);

// Get a specific recommendation by ID
router.get("/:id", getRecommendationById);

// Delete a recommendation
router.delete("/:id", deleteRecommendation);

export default router;
