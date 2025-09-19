import { Router } from "express";
import { getOwnerProfile, updateOwnerProfile } from "../controllers/owner";

const router = Router();

// GET owner profile (by userId)
router.get("/:userId", getOwnerProfile);

// UPDATE owner profile (by userId)
router.put("/:userId", updateOwnerProfile);

export default router;
