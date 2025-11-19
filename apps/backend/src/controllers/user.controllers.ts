import type { Response, Request } from "express";
import { PrismaClient } from "../../generated/prisma/client.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middlewares.js";
import type { Prisma } from "../../generated/prisma/client.js";

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
				deletedAt: true,
				_count: {
					select: {
						sentMessages: true,
						receivedMessages: true,
						properties: true,
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

interface UpdateUserBody {
	username?: string;
	email?: string;
	role?: "ADMIN" | "USER" | "OWNER";
	bio?: string;
	phone?: string;
	avatarUrl?: string;
}

export const updateUser = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<Response | void> => {
	const { id } = req.params;
	const userId = req.user?.userId;
	const role = req.user?.role;

	if (!id) {
		return res.status(400).json({ error: "User ID is required" });
	}
	try {
		const body = req.body as UpdateUserBody;
		const { username, email, bio, phone, role } = body;
		const avatarFile = req.file;

		// check if user to update exists;
		const user = await prisma.user.findUnique({
			where: { id },
			omit: {
				password: true,
				refreshToken: true,
			},
		});
		if (!user) {
			return res.status(404).json({
				error: "User not found.",
			});
		}

		// check if logged in user is user or admin;
		if (req.user?.userId !== user.id && req.user?.role !== "ADMIN") {
			return res.status(403).json({
				error: "Unauthorized!",
			});
		}

		// Validate required fields
		if (!username?.trim() || !email?.trim() || !role) {
			return res
				.status(400)
				.json({ error: "Username, email, and role are required" });
		}

		const updateData: Prisma.UserUpdateInput = {
			username: { set: username.trim() },
			email: { set: email.trim() },
			role: { set: role },
			bio: { set: bio?.trim() || null },
			phone: { set: phone?.trim() || null },
		};

		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateData,
		});

		return res.status(200).json({
			message: "User updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.error("Error in updateUser", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
