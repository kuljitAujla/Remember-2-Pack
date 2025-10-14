import express from "express"
import { upload, uploadImage, confirmUpload, cancelUpload } from "../controllers/imageController.js";
import userAuth from "../middleware/userAuth.js";

const imageRouter = express.Router();

imageRouter.post("/upload-image", userAuth, upload, uploadImage)
imageRouter.post("/confirm-upload", userAuth, confirmUpload);
imageRouter.post("/cancel-upload", userAuth, cancelUpload);

export default imageRouter;