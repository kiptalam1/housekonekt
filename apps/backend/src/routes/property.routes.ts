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
	updateProperty,
	getPropertyByOwner,
} from "../controllers/property.controllers.js";
import {
	validatePropertyCreationInput,
	validatePropertyUpdateInput,
} from "../validators/property.validators.js";
import { handleValidationErrors } from "../middlewares/validation.middleware.js";
import { upload } from "../middlewares/upload.middlewares.js";

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
router.patch(
	"/:id/update",
	verifyAuthenticationToken,
	isAdminOrOwner,
	upload.array("images", 6),
	validatePropertyUpdateInput,
	handleValidationErrors,
	updateProperty
);
router.get("/:id/property", attachUserIfAuthenticated, getPropertyByOwner);
export default router;
