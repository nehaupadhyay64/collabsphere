import express from "express";
import { explain, improve, docs, readme } from "../controllers/geminiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // sirf logged-in user AI use kar sakta hai

router.post("/explain", explain);
router.post("/improve", improve);
router.post("/docs", docs);
router.post("/readme", readme);

export default router;