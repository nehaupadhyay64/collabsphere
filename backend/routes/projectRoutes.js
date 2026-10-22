import express from "express";
import {
  getProjects,
  createProject,
  getProjectById,
  addMember,
  toggleShare,
  getAnalytics,
  getPublicProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route: protect se PEHLE (login nahi chahiye) aur /:id se bhi pehle
router.get("/public/:shareId", getPublicProject);

router.use(protect); // iske neeche ke saare routes protected hain

router.route("/").get(getProjects).post(createProject);
router.get("/:id", getProjectById);
router.post("/:id/members", addMember);
router.patch("/:id/share", toggleShare);
router.get("/:id/analytics", getAnalytics);

export default router;