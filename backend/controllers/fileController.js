import path from "path";
import fs from "fs/promises";
import File from "../models/File.js";
import config from "../config/index.js";
import getProjectForUser from "../utils/projectAccess.js";
import asyncHandler from "../utils/asyncHandler.js";

const TEXT_EXTS = [".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cpp", ".html", ".css", ".json", ".md", ".txt"];

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const file = await File.create({
    project: req.params.id,
    uploadedBy: req.user._id,
    originalName: req.file.originalname,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
  res.status(201).json(await file.populate("uploadedBy", "name"));
});

export const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find({ project: req.params.id })
    .populate("uploadedBy", "name")
    .sort({ createdAt: -1 });
  res.json(files);
});

// Text/code file ka content (preview + "Explain this code" ke liye)
export const getFileContent = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.fileId);
  if (!file || !(await getProjectForUser(file.project, req.user._id)))
    return res.status(404).json({ message: "File not found" });

  const ext = path.extname(file.filename).toLowerCase();
  if (!TEXT_EXTS.includes(ext))
    return res.status(400).json({ message: "Preview is only available for text files" });

  const content = await fs.readFile(path.join(config.uploadDir, file.filename), "utf-8");
  res.json({ content });
});

// Image ya koi bhi file, sirf logged-in project member ko milegi
export const downloadFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.fileId);
  if (!file || !(await getProjectForUser(file.project, req.user._id)))
    return res.status(404).json({ message: "File not found" });

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.sendFile(path.resolve(config.uploadDir, file.filename));
});