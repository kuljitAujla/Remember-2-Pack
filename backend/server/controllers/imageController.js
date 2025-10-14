import multer from "multer"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv"
dotenv.config()

//middleware
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage}).single('image');


const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION
});

export const uploadImage = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Creates a unique filename with timestamp to avoid collisions
    const timestamp = Date.now();
    const fileName = `${timestamp}-${req.file.originalname}`;
    
    // Creates S3 key with user folder structure: userId/timestamp-filename
    const s3Key = `${userId}/${fileName}`;
    
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }
    
    const command = new PutObjectCommand(params);
    await s3.send(command);
    
    res.json({ 
      success: true, 
      message: "Image uploaded successfully",
      key: s3Key,
      fileName: fileName
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to upload image",
      error: error.message 
    });
  }
}