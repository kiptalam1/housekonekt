import { PrismaClient, Role } from "../../generated/prisma/client.js";
import type { Request, Response } from "express";
import { comparePasswords, hashUserPassword } from "../utils/password.utils.js";
import { generateAccessTokenAndSetCookie } from "../utils/token.utils.js";

const prisma = new PrismaClient();

const isProd = process.env.NODE_ENV !== "production";

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
			omit: {
				password: true,
			},
		});

		// now return the response;
		return res.status(201).json({
			message: "Account created successfully",
			user: newUser,
		});
	} catch (error) {
		if (!isProd) {
			console.error("Error in register_user", error);
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const loginUser = async (
	req: Request<{}, {}, { email: string; password: string }>,
	res: Response
): Promise<Response> => {
	const { email, password } = req.body;

	try {
		// check if user has an account;
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			return res
				.status(400)
				.json({ error: "User not found. Please create an account" });
		}

		// if account is present, check if password is correct;
		const isMatch = await comparePasswords(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ error: "Wrong password" });
		}

		// if all passes, generate token and put it in cookie return response;
		const accessToken = generateAccessTokenAndSetCookie(
			req,
			res,
			user.id,
			user.role
		);
		// omit password by destructuring user;
		const { password: _, ...userWithoutPassword } = user;
		return res.status(200).json({
			message: "Logged in successfully",
			accessToken,
			user: userWithoutPassword,
		});
	} catch (error) {
		if (!isProd) {
			console.error("Error in loginUser", error);
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};