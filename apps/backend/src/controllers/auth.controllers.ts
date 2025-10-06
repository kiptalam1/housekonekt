import { PrismaClient, Role } from "../../generated/prisma/client.js";
import type { Request, Response } from "express";
import { hashUserPassword } from "../utils/password.utils.js";

const prisma = new PrismaClient();

export const registerUser = async (
	req: Request<
		{},
		{},
		{ username: string; email: string; password: string; role: Role }
	>,
	res: Response
): Promise<Response | void> => {
	const { username, email, password, role } = req.body;

	try {
		// check if user is already registered;
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
			omit: {
				password: true,
			},
		});

		if (user) {
			return res.status(400).json({ error: "This account already exists." });
		}

		// if not registered, hash the user's password;
		const hashedPassword = await hashUserPassword(password);
		// now create the new user with hashed password;
		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				role,
			},
		});

		// now return the response;
		return res.status(201).json({
			message: "Account created successfully",
			user: newUser,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error in register_user", error.message);
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};
