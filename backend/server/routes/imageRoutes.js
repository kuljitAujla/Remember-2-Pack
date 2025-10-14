import express from "express"
import { upload, uploadImage } from "../controllers/imageController.js";
import userAuth from "../middleware/userAuth.js";

const imageRouter = express.Router();

imageRouter.post("/upload-image", userAuth, upload, uploadImage)

export default imageRouter;