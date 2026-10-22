import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/projects/:id/notes").get(protect, getNotes).post(protect, createNote);
router.route("/notes/:noteId").put(protect, updateNote).delete(protect, deleteNote);

export default router;