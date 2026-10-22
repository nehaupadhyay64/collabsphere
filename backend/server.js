import config from "./config/index.js";
import express from "express";
import cors from "cors";
import multer from "multer";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("CollabSphere API running 🚀"));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", notesRoutes);
app.use("/api", fileRoutes);
app.use("/api/gemini", geminiRoutes);

// Error handler (hamesha last mein)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || (err instanceof multer.MulterError ? 400 : 500);
  res.status(status).json({ message: err.message || "Server error" });
});

app.listen(config.port, () => console.log(`Server on port ${config.port} 🚀`));