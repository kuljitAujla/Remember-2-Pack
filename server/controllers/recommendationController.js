import recommendationModel from "../models/recommendationModel.js";

export const saveRecommendation = async (req, res) => {
    try {
        const { title, packedItems, tripSummary, aiRecommendations } = req.body;
        const userId = req.body.userId; // User ID set by authentication middleware

        const recommendation = new recommendationModel({
            userId,
            title,
            packedItems,
            tripSummary,
            aiRecommendations
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
            .select('-aiRecommendations'); // Exclude the full content for list view

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
