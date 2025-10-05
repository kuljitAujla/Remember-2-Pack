import { Router } from "express";
import { recommendController } from "../controllers/recommendController.js";
import userAuth from "../middleware/userAuth.js";

const router = Router();

// POST /recommend
router.post("/recommend", userAuth, recommendController);

export default router;