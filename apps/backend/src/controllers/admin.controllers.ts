import type { NextFunction, Response, Request } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middlewares.js";
import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export function isAdmin(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Response | void {
	const userId = req.user?.userId as string;
	const role = req.user?.role;

	if (!userId) return;

	try {
		// check if user is admin;
		if (role !== "ADMIN") {
			return res.status(403).json({ error: "Unauthorized!" });
		} else {
			next();
		}
	} catch (error) {
		console.error("Error in isAdmin middleware", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function softDeleteUser(
	req: AuthenticatedRequest & Request<{ id: string }>,
	res: Response
): Promise<Response | void> {
	const { id: userID } = req.params;
	try {
		// check if user exists;
		const user = await prisma.user.findUnique({
			where: {
				id: userID,
			},
			omit: {
				password: true,
				refreshToken: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user.role === "ADMIN") {
			return res.status(400).json({ error: "Admin cannot be deleted" });
		}
		if (user.deletedAt !== null) {
			return res.status(400).json({ error: "User no longer exists" });
		}
		// soft delete if exists(update deletedAt to Datetime);
		const deletedUser = await prisma.user.update({
			where: {
				id: userID,
			},
			data: {
				deletedAt: new Date(),
			},
			omit: {
				password: true,
				refreshToken: true,
			},
		});

		return res.status(200).json({
			message: "User deleted successfully",
			data: deletedUser,
		});
	} catch (error) {
		console.error("Error deleting user", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
