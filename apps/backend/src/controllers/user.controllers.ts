import type { Response } from "express";
import { PrismaClient } from "../../generated/prisma/client.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middlewares.js";
import type { Prisma } from "../../generated/prisma/client.js";
import cloudinary from "../configs/cloudinary.configs.js";
import { MulterError } from "multer";
import type { UploadApiResponse } from "cloudinary";

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

		const normalizedEmail = email?.trim().toLowerCase();
		const currentEmail = user.email?.trim().toLowerCase();

		// the update object;
		const updateData: Prisma.UserUpdateInput = {};

		// only update if different from current in db;
		if (username?.trim() && username?.trim() !== user.username) {
			updateData.username = { set: username.trim() };
		}

		if (normalizedEmail && normalizedEmail !== currentEmail) {
			const existing = await prisma.user.findUnique({
				where: {
					email: normalizedEmail,
				},
			});
			if (existing && existing.id !== user.id) {
				return res.status(400).json({ error: "Email already in use" });
			}
			updateData.email = { set: normalizedEmail };
		}

		if (role && role !== user.role) updateData.role = { set: role };

		if (bio !== undefined && bio?.trim() !== user.bio)
			updateData.bio = { set: bio?.trim() || null };

		if (phone !== undefined && phone?.trim() !== user.phone)
			updateData.phone = { set: phone?.trim() || null };

		// let cloudinaryResult: UploadApiResponse | undefined;
		if (avatarFile?.buffer) {
			const cloudinaryResult = await new Promise<UploadApiResponse>(
				(resolve, reject) => {
					const stream = cloudinary.uploader.upload_stream(
						{
							folder: "avatars",
						},
						(error, result) => {
							if (error) reject(error);
							if (!result)
								return reject(new Error("No result from cloudinary"));
							resolve(result);
						}
					);
					stream.write(avatarFile.buffer);
					stream.end();
				}
			);
			// console.log("CLOUDINARY :", cloudinaryResult);

			updateData.avatarUrl = { set: cloudinaryResult.secure_url };
			updateData.public_id = { set: cloudinaryResult.public_id };
		}

		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateData,
			include: {
				_count: {
					select: {
						sentMessages: true,
						receivedMessages: true,
					},
				},
			},
		});

		return res.status(200).json({
			message: "User updated successfully",
			data: updatedUser,
		});
	} catch (error: unknown) {
		if (error instanceof MulterError) {
			let message = "";
			switch (error.code) {
				case "LIMIT_FILE_SIZE":
					message = "File too large. Maximum allowed size is 5MB.";
					break;
				case "LIMIT_UNEXPECTED_FILE":
					message = "Too many files uploaded.";
					break;
				default:
					message = error.message;
			}

			return res.status(400).json({ error: message });
		}
		// fileFilter or other errors
		if (error instanceof Error) {
			return res.status(400).json({ error: error.message });
		}

		console.error("Error in updateUser", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
