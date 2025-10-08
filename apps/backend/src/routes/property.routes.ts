import { Router } from "express";
import {
	attachUserIfAuthenticated,
	isAdminOrOwner,
	verifyAuthenticationToken,
} from "../middlewares/auth.middlewares.js";
import {
	createProperty,
	getAllProperty,
	getSinglePropertyListing,
	softDeleteProperty,
} from "../controllers/property.controllers.js";
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

router.get("/", attachUserIfAuthenticated, getAllProperty);
router.get("/:id", attachUserIfAuthenticated, getSinglePropertyListing);
router.patch(
	"/:id/delete",
	verifyAuthenticationToken,
	isAdminOrOwner,
	softDeleteProperty
);

export default router;
