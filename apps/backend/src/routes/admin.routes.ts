import { Router } from "express";
import { verifyAuthenticationToken } from "../middlewares/auth.middlewares.js";
import {
	isAdmin,
	softDeleteOwnerAndProperties,
	softDeleteUser,
} from "../controllers/admin.controllers.js";

const router = Router();

router.patch(
	"/user/:id/delete",
	verifyAuthenticationToken,
	isAdmin,
	softDeleteUser
);
router.patch(
	"/owner-property/:id/delete",
	verifyAuthenticationToken,
	isAdmin,
	softDeleteOwnerAndProperties
);

export default router;
