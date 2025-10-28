import express from "express";
import { verifyAuthenticationToken } from "../middlewares/auth.middlewares.js";
import {
	getAnotherUser,
	getMyProfile,
} from "../controllers/user.controllers.js";

const router = express.Router();

// routes;
router.get("/me", verifyAuthenticationToken, getMyProfile);

router.get("/:id", verifyAuthenticationToken, getAnotherUser);
export default router;
