import express from "express";
import { verifyAuthenticationToken } from "../middlewares/auth.middlewares.js";
import {
	getAllUsers,
	getAnotherUser,
	getMyProfile,
	updateUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/upload.middlewares.js";

const router = express.Router();

// routes;
router.get("/me", verifyAuthenticationToken, getMyProfile);

router.get("/all-users", verifyAuthenticationToken, getAllUsers);
router.patch(
	"/user/:id/update",
	verifyAuthenticationToken,
	upload.single("avatarUrl"),
	updateUser
);
router.get("/:id", verifyAuthenticationToken, getAnotherUser);
export default router;
