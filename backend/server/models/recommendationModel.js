import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: "My Trip"
    },
    packedItems: {
        type: [String],
        required: true
    },
    tripSummary: {
        type: String,
        required: true
    },
    aiRecommendations: {
        type: String,
        required: true
    },
    imageKey: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const recommendationModel = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);

export default recommendationModel;
