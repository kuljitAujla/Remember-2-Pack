import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import recommendRoutes from "./routes/recommendRoutes.js";

const app = express();
const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "../dist")));

// routes
app.use("/", recommendRoutes);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
