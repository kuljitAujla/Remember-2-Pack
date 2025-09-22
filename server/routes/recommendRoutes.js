import { Router } from "express";
import { recommendController } from "../controllers/recommendController.js";

const router = Router();

// POST /recommend
router.post("/recommend", recommendController);

export default router;
