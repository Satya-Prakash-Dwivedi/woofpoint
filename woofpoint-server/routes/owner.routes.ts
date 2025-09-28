import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getOwnerProfile, updateOwnerProfile } from "../controllers/owner";

const router = express.Router();

router.get("/profile", authMiddleware, getOwnerProfile);
router.put("/profile", authMiddleware, updateOwnerProfile);

export default router;