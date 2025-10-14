import multer from "multer";
import dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  RekognitionClient,
  DetectLabelsCommand,
} from "@aws-sdk/client-rekognition";

dotenv.config();

// Multer Middleware
const storage = multer.memoryStorage();
export const upload = multer({ storage }).single("image");

// =============== AWS Clients ===============
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const rekognitionClient = new RekognitionClient({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// =============== Rekognition Helper ===============
export const detectImageItems = async (bucketName, key) => {
  const command = new DetectLabelsCommand({
    Image: {
      S3Object: {
        Bucket: bucketName,
        Name: key,
      },
    },
    MaxLabels: 25, // top 25 labels
    MinConfidence: 75, // ignore low confidence
  });

  const response = await rekognitionClient.send(command);
  return response.Labels.map((label) => ({
    name: label.Name,
    confidence: label.Confidence,
  }));
};

// =============== Upload + Detect Route ===============
export const uploadImage = async (req, res) => {
  console.log("=== Upload Image Request Received ===");
  try {
    const userId = req.userId;
    console.log("User ID:", userId);

    if (!userId) {
      console.log("ERROR: User not authenticated");
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    console.log("File received:", req.file ? "Yes" : "No");
    if (!req.file) {
      console.log("ERROR: No image provided");
      return res
        .status(400)
        .json({ success: false, message: "No image provided" });
    }

    // Unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${req.file.originalname}`;

    // TEMP folder path for uploaded file
    const s3Key = `temp-uploads/${userId}/${fileName}`;
    console.log("S3 Key:", s3Key);
    console.log("Bucket:", process.env.BUCKET_NAME);

    // Upload to S3
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    console.log("Uploading to S3...");
    await s3.send(new PutObjectCommand(uploadParams));
    console.log("S3 upload successful!");

    // Run Rekognition to detect items
    console.log("Running Rekognition...");
    const detectedItems = await detectImageItems(
      process.env.BUCKET_NAME,
      s3Key
    );
    console.log("Rekognition successful! Detected items:", detectedItems.length);

    res.json({
      success: true,
      message: "Image uploaded and analyzed successfully",
      key: s3Key,
      fileName,
      detectedItems,
    });
  } catch (error) {
    console.error("Upload/Detection Error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: "Failed to upload or analyze image",
      error: error.message,
      errorCode: error.code,
    });
  }
};

// =============== Confirm Upload (move to permanent folder) ===============
export const confirmUpload = async (req, res) => {
  try {
    const { tempKey } = req.body;
    const userId = req.userId; // Get from auth middleware

    if (!tempKey) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: tempKey",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const fileName = tempKey.split("/").pop();
    const newKey = `${userId}/${fileName}`;

    // Copy to permanent folder
    await s3.send(
      new CopyObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        CopySource: `${process.env.BUCKET_NAME}/${tempKey}`,
        Key: newKey,
      })
    );

    // Delete from temp folder
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: tempKey,
      })
    );

    res.json({ success: true, newKey });
  } catch (error) {
    console.error("Confirm Upload Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to confirm upload", error });
  }
};

// =============== Cancel Upload (delete from temp) ===============
export const cancelUpload = async (req, res) => {
  try {
    const { tempKey } = req.body;

    if (!tempKey) {
      return res
        .status(400)
        .json({ success: false, message: "Missing tempKey" });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: tempKey,
      })
    );

    res.json({ success: true, message: "Temporary image deleted" });
  } catch (error) {
    console.error("Cancel Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete temporary image",
      error: error.message,
    });
  }
};
