import { Router } from "express";
import { recommendController } from "../controllers/recommendController.js";

const router = Router();

// POST /api/recommend
router.post("/api/recommend", recommendController);

export default router;
