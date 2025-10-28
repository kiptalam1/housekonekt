import { type Response } from "express";
import { PrismaClient } from "../../generated/prisma/client.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middlewares.js";

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
