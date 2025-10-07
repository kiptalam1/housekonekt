import { Router } from "express";
import {
	isAdminOrOwner,
	verifyAuthenticationToken,
} from "../middlewares/auth.middlewares.js";
import { createProperty } from "../controllers/property.controllers.js";
import { validatePropertyCreationInput } from "../validators/property.validators.js";
import { handleValidationErrors } from "../middlewares/validation.middleware.js";

const router = Router();

router.post(
	"/create",
	verifyAuthenticationToken,
	isAdminOrOwner,
	validatePropertyCreationInput,
	handleValidationErrors,
	createProperty
);

export default router;
