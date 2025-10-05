import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import recommendRoutes from "./routes/recommendRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
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
  origin: process.env.FRONTEND_URL,
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

// serve frontend static files (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // Catch-all handler: send back React's index.html file for any non-API routes
  // This is essential for React Router to work properly
  app.use((req, res, next) => {
    // Skip if it's an API route
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
