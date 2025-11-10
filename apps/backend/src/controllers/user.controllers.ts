import { type Response } from "express";
import { PrismaClient } from "../../generated/prisma/client.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middlewares.js";
import { error } from "console";

const prisma = new PrismaClient();
const isDev = process.env.NODE_ENV === "development";

export const getMyProfile = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<Response | void> => {
	try {
		const userId = req.user?.userId as string;
		const role = req.user?.role;

		// check if user exists;
		const user = await prisma.user.findUnique({
			where: { id: userId },
			omit: {
				password: true,
				refreshToken: true,
				updatedAt: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: "User profile no longer exists" });
		}

		let property;
		if (role === "OWNER") {
			property = await prisma.property.findMany({
				where: {
					ownerId: userId,
					deletedAt: null,
				},
				omit: {},
			});
		}

		return res.status(200).json({ data: { user, property } });
	} catch (error) {
		if (isDev) {
			console.error("Error getting my profile", error);
		}

		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getAnotherUser = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<Response | void> => {
	try {
		const id = req.params.id as string;

		// check if user exists;
		const user = await prisma.user.findUnique({
			where: { id },
			omit: {
				password: true,
				refreshToken: true,
				updatedAt: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: "This user no longer exists" });
		}

		return res.status(200).json({ data: user });
	} catch (error) {
		if (isDev) {
			console.error("Error getting another user", error);
		}

		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllUsers = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<Response | void> => {
	try {
		const userId = req.user?.userId as string;
		const role = req.user?.role;

		if (!userId || role !== "ADMIN") {
			return res.status(400).json({
				error: "Invalid user ID or not Admin",
			});
		}

		// check if user is present and is admin;
		const admin = await prisma.user.findUnique({
			where: {
				id: userId,
				role: "ADMIN",
			},
		});
		if (!admin) {
			return res.status(404).json({ error: "Admin not found" });
		}

		// now fetch all users;
		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
				bio: true,
				phone: true,
				isVerified: true,
				avatarUrl: true,
				lastLogin: true,
				createdAt: true,
				_count: {
					select: {
						sentMessages: true,
						receivedMessages: true,
					},
				},
			},
		});
		return res.status(200).json({
			data: users,
		});
	} catch (error) {
		if (isDev) {
			console.error("Error getting all users", error);
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};