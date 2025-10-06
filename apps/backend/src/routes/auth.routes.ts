import express, { type Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";

const router: Router = express.Router();

router.post("/register", registerUser);

export default router;
