import Note from "../models/Note.js";
import getProjectForUser from "../utils/projectAccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNotes = asyncHandler(async (req, res) => {
  if (!(await getProjectForUser(req.params.id, req.user._id)))
    return res.status(404).json({ message: "Project not found" });

  const notes = await Note.find({ project: req.params.id })
    .populate("author", "name")
    .sort({ updatedAt: -1 });
  res.json(notes);
});

export const createNote = asyncHandler(async (req, res) => {
  if (!(await getProjectForUser(req.params.id, req.user._id)))
    return res.status(404).json({ message: "Project not found" });

  const { title, content } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const note = await Note.create({
    project: req.params.id,
    author: req.user._id,
    title,
    content,
  });
  res.status(201).json(await note.populate("author", "name"));
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note || !(await getProjectForUser(note.project, req.user._id)))
    return res.status(404).json({ message: "Note not found" });

  note.title = req.body.title ?? note.title;
  note.content = req.body.content ?? note.content;
  await note.save();
  res.json(await note.populate("author", "name"));
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note || !(await getProjectForUser(note.project, req.user._id)))
    return res.status(404).json({ message: "Note not found" });

  await note.deleteOne();
  res.json({ message: "Note deleted", id: note._id });
});