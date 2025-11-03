import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import recommendRoutes from "./routes/recommendRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend server is running" });
});

// API endpoints
app.use("/api", recommendRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/image", imageRoutes);

// For unknown routes 
const frontendPath = path.join(__dirname, "../frontend/dist"); 

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendPath));


  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
