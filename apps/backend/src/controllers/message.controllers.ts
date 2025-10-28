import { type Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middlewares.js";
import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export async function getUserDMs(req: AuthenticatedRequest, res: Response) {
	const userId = req.user?.userId as string;
	const ownerId = req.params.id as string;
	try {
		if (!userId || !ownerId)
			return res.status(400).json({ error: "Missing user or owner ID" });

		// check both exist
		const [user, owner] = await Promise.all([
			prisma.user.findUnique({ where: { id: userId } }),
			prisma.user.findUnique({ where: { id: ownerId } }),
		]);

		if (!user) return res.status(404).json({ error: "User not found" });
		if (!owner) return res.status(404).json({ error: "Owner not found" });

		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{ senderId: userId, receiverId: ownerId },
					{ senderId: ownerId, receiverId: userId },
				],
			},
			orderBy: { createdAt: "asc" },
		});

		return res.status(200).json({ data: messages });
	} catch (error) {
		console.error("getUserDMs error:", error);
		return res.status(500).json({ error: "Failed to fetch DMs" });
	}
}

export async function fetchChatList(req: AuthenticatedRequest, res: Response) {
	const userId = req.user?.userId as string;
	try {
		if (!userId) return res.status(400).json({ error: "Missing user ID" });

		const user = await prisma.user.findUnique({
			where: { id: userId },
			omit: { password: true, refreshToken: true },
		});

		if (!user) return res.status(404).json({ error: "User not found" });

		const messages = await prisma.message.findMany({
			where: {
				OR: [{ senderId: userId }, { receiverId: userId }],
			},
			include: {
				receiver: {
					omit: {
						password: true,
						refreshToken: true,
					},
				},
				sender: {
					omit: {
						password: true,
						refreshToken: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		//deduplicate by other participant id;
		const chatMap = new Map();
		for (const msg of messages) {
			const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
			if (!chatMap.has(otherUser.id)) chatMap.set(otherUser.id, otherUser);
		}

		const chatList = Array.from(chatMap.values());

		return res.status(200).json({ data: chatList });
	} catch (error) {
		console.error("fetchAllMyChats error:", error);
		return res.status(500).json({ error: "Failed to fetch user chats" });
	}
}
