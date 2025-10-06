import express, { type Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { validateRegistrationFields } from "../validators/auth.validators.js";
import { handleValidationErrors } from "../middlewares/validation.middleware.js";

const router: Router = express.Router();

router.post(
	"/register",
	validateRegistrationFields,
	handleValidationErrors,
	registerUser
);

export default router;
