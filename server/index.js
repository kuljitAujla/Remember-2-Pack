import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import recommendRoutes from "./routes/recommendRoutes.js";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
const port = 3001;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}));

// API endpoints
app.use("/api", recommendRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

// serve frontend static files
app.use(express.static(path.join(__dirname, "../dist")));

// Catch-all handler: send back React's index.html file for any non-API routes
// This is essential for React Router to work properly
app.use((req, res, next) => {
  // Skip if it's an API route
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
