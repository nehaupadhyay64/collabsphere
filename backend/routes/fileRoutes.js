import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import config from "../config/index.js";
import {
  uploadFile,
  getFiles,
  getFileContent,
  downloadFile,
} from "../controllers/fileController.js";
import { protect } from "../middleware/authMiddleware.js";
import getProjectForUser from "../utils/projectAccess.js";
import asyncHandler from "../utils/asyncHandler.js";

fs.mkdirSync(config.uploadDir, { recursive: true });

const ALLOWED_EXTS = [
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cpp",
  ".html", ".css", ".json", ".md", ".txt",
  ".png", ".jpg", ".jpeg", ".gif", ".webp",
];

const upload = multer({
  storage: multer.diskStorage({
    destination: config.uploadDir,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      const err = new Error("This file type is not allowed");
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

// Upload se PEHLE check: user is project ka member hai ya nahi
const checkProjectAccess = asyncHandler(async (req, res, next) => {
  const project = await getProjectForUser(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  next();
});

const router = express.Router();

router
  .route("/projects/:id/files")
  .get(protect, checkProjectAccess, getFiles)
  .post(protect, checkProjectAccess, upload.single("file"), uploadFile);

router.get("/files/:fileId/content", protect, getFileContent);
router.get("/files/:fileId/download", protect, downloadFile);

export default router;