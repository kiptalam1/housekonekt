import express from "express";
import {
	fetchChatList,
	getUserDMs,
} from "../controllers/message.controllers.js";
import { verifyAuthenticationToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/:id", verifyAuthenticationToken, getUserDMs);
router.get("/", verifyAuthenticationToken, fetchChatList);

export default router;
