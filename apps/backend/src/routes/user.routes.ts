import express from "express";
import { verifyAuthenticationToken } from "../middlewares/auth.middlewares.js";
import {
	getAllUsers,
	getAnotherUser,
	getMyProfile,
} from "../controllers/user.controllers.js";

const router = express.Router();

// routes;
router.get("/me", verifyAuthenticationToken, getMyProfile);

router.get("/all-users", verifyAuthenticationToken, getAllUsers);

router.get("/:id", verifyAuthenticationToken, getAnotherUser);
export default router;
