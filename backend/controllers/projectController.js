import Project from "../models/Project.js";
import User from "../models/User.js";
import Note from "../models/Note.js";
import File from "../models/File.js";
import getProjectForUser from "../utils/projectAccess.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto";

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate("owner", "name")
    .sort({ createdAt: -1 });
  res.json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const project = await Project.create({ title, description, owner: req.user._id });
  await project.populate("owner", "name");
  res.status(201).json(project);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await getProjectForUser(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
});

export const addMember = asyncHandler(async (req, res) => {
  const project = await getProjectForUser(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!project.owner._id.equals(req.user._id))
    return res.status(403).json({ message: "Only owner can add members" });

  const email = req.body.email?.toLowerCase().trim();
  const member = await User.findOne({ email });
  if (!member) return res.status(404).json({ message: "No user with this email" });

  if (
    project.owner._id.equals(member._id) ||
    project.members.some((m) => m._id.equals(member._id))
  )
    return res.status(400).json({ message: "Already in project" });

  project.members.push(member._id);
  await project.save();
  res.json(await getProjectForUser(req.params.id, req.user._id));
});

// Public link on/off (sirf owner)
export const toggleShare = asyncHandler(async (req, res) => {
  const project = await getProjectForUser(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!project.owner._id.equals(req.user._id))
    return res.status(403).json({ message: "Only owner can change sharing" });

  project.isPublic = !project.isPublic;
  // Public karte waqt naya shareId banao (purane projects ke liye bhi chalega)
  if (project.isPublic) project.shareId = crypto.randomBytes(6).toString("hex");
  await project.save();
  res.json({ isPublic: project.isPublic, shareId: project.shareId });
});

// Kis member ne kitne notes aur files banaye
export const getAnalytics = asyncHandler(async (req, res) => {
  const project = await getProjectForUser(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const [notes, files] = await Promise.all([
    Note.find({ project: req.params.id }),
    File.find({ project: req.params.id }),
  ]);

  const people = [project.owner, ...project.members];
  const perMember = people.map((p) => ({
    name: p.name,
    notes: notes.filter((n) => n.author.equals(p._id)).length,
    files: files.filter((f) => f.uploadedBy.equals(p._id)).length,
  }));

  res.json({ totalNotes: notes.length, totalFiles: files.length, perMember });
});

// Public page (login nahi chahiye)
export const getPublicProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    shareId: req.params.shareId,
    isPublic: true,
  }).populate("owner", "name");
  if (!project) return res.status(404).json({ message: "Public project not found" });

  const notes = await Note.find({ project: project._id })
    .select("title content updatedAt")
    .sort({ updatedAt: -1 });

  res.json({
    title: project.title,
    description: project.description,
    owner: project.owner.name,
    notes,
  });
});