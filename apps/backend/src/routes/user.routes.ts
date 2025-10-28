import express from "express";
import { verifyAuthenticationToken } from "../middlewares/auth.middlewares.js";
import { getMyProfile } from "../controllers/user.controllers.js";

const router = express.Router();

// routes;
router.get("/me", verifyAuthenticationToken, getMyProfile);

router.get("/:id", verifyAuthenticationToken, getMyProfile);
export default router;
