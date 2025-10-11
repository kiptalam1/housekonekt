import express, { type Router } from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	verifyUserEmail,
} from "../controllers/auth.controllers.js";
import { validateRegistrationFields } from "../validators/auth.validators.js";
import { handleValidationErrors } from "../middlewares/validation.middleware.js";
import { verifyAuthenticationToken } from "../middlewares/auth.middlewares.js";

const router: Router = express.Router();

router.post(
	"/register",
	validateRegistrationFields,
	handleValidationErrors,
	registerUser
);

router.post("/login", loginUser);
router.post("/logout", verifyAuthenticationToken, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/verify/:token", verifyUserEmail);

export default router;
