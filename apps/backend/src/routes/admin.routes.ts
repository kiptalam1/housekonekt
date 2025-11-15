import express, { Router } from "express";
import { verifyAuthenticationToken } from "../middlewares/auth.middlewares.js";
import { isAdmin, softDeleteUser } from "../controllers/admin.controllers.js";

const router = Router();

router.patch("/user/:id/delete", verifyAuthenticationToken, isAdmin, softDeleteUser);

export default router;