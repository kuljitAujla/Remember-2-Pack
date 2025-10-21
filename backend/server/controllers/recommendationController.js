import recommendationModel from "../models/recommendationModel.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

// Initialize S3 client
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

export const saveRecommendation = async (req, res) => {
    try {
        const { title, packedItems, tripSummary, aiRecommendations, imageKey } = req.body;
        const userId = req.body.userId; // User ID set by authentication middleware

        const recommendation = new recommendationModel({
            userId,
            title,
            packedItems,
            tripSummary,
            aiRecommendations,
            imageKey: imageKey || null // Optional: Store S3 image key if provided
        });

        const savedRecommendation = await recommendation.save();
        res.status(201).json({
            success: true,
            message: "Recommendation saved successfully",
            recommendation: savedRecommendation
        });
    } catch (error) {
        console.error("Error saving recommendation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save recommendation",
            error: error.message
        });
    }
};

export const getUserRecommendations = async (req, res) => {
    try {
        const userId = req.body.userId; // User ID set by authentication middleware
        
        const recommendations = await recommendationModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .select('-aiRecommendations'); // everything but aiRecommendations

        res.status(200).json({
            success: true,
            recommendations
        });
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recommendations",
            error: error.message
        });
    }
};

export const getRecommendationById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;

        const recommendation = await recommendationModel.findOne({
            _id: id,
            userId
        });

        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: "Recommendation not found"
            });
        }

        res.status(200).json({
            success: true,
            recommendation
        });
    } catch (error) {
        console.error("Error fetching recommendation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recommendation",
            error: error.message
        });
    }
};

export const deleteRecommendation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;

        const recommendation = await recommendationModel.findOneAndDelete({
            _id: id,
            userId
        });

        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: "Recommendation not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Recommendation deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting recommendation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete recommendation",
            error: error.message
        });
    }
};

export const imageURL = async (req, res) => {
    const { key } = req.params;
    const userId = req.body.userId; // Get from auth middleware

    try {
        if (!key) {
            return res.status(400).json({
                success: false, 
                message: "No image Key provided"
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // Verify the image belongs to the user (security check)
        if (!key.startsWith(`${userId}/`)) {
            return res.status(403).json({
                success: false,
                message: "Access denied to this image"
            });
        }

        // Creates signed URL
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        });

        // Generates signed URL valid for 1 hour
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        
        res.status(200).json({
            success: true,
            imageUrl: signedUrl
        });
    } catch (error) {
        console.error("Error providing image url:", error);
        res.status(500).json({
            success: false,
            message: "Failed to provide image url",
            error: error.message
        });
    }
};
