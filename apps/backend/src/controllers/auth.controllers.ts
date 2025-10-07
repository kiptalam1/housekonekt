import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "../../generated/prisma/client.js";
import type { Request, Response } from "express";
import { comparePasswords, hashUserPassword } from "../utils/password.utils.js";
import {
	generateAccessTokenAndSetCookie,
	generateRefreshTokenAndSetCookie,
} from "../utils/token.utils.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middlewares.js";

const prisma = new PrismaClient();

const isProd = process.env.NODE_ENV === "production";

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
		const refreshToken = generateRefreshTokenAndSetCookie(
			req,
			res,
			user.id,
			user.role
		);
		await prisma.user.update({
			where: { id: user.id },
			data: { refreshToken },
		});
		// omit password by destructuring user;
		const {
			password: _,
			refreshToken: _refresh_token,
			...userWithoutPassword
		} = user;
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

export const logoutUser = async (
	_req: Request,
	res: Response
): Promise<Response> => {
	res.clearCookie("accessToken", {
		httpOnly: true,
		sameSite: isProd ? "strict" : "none",
		secure: isProd,
	});

	res.clearCookie("refreshToken", {
		httpOnly: true,
		sameSite: isProd ? "strict" : "none",
		secure: isProd,
	});

	return res.status(200).json({
		message: "Logged out successfully",
	});
};

export const refreshAccessToken = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<Response> => {
	try {
		const refreshToken = req.cookies?.refreshToken;
		if (!refreshToken) {
			return res.status(401).json({ error: "No refresh token found" });
		}

		if (!process.env.REFRESH_SECRET) {
			throw new Error("REFRESH_SECRET not defined");
		}

		// verify refresh token validity
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET) as {
			userId: string;
			role: Role;
		};

		// confirm refresh token matches what’s stored in DB

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.userId,
			},
			select: {
				refreshToken: true,
			},
		});

		if (!user || user.refreshToken !== refreshToken) {
			return res.status(403).json({ error: "Invalid refresh token" });
		}

		// if passes then generate access token and attach to cookie;
		const newAccessToken = generateAccessTokenAndSetCookie(
			req,
			res,
			decoded.userId,
			decoded.role
		);

		// generate a new refresh token and save in db;
		const newRefreshToken = generateRefreshTokenAndSetCookie(
			req,
			res,
			decoded.userId,
			decoded.role
		);

		// store the new refresh token
		await prisma.user.update({
			where: { id: decoded.userId },
			data: {
				refreshToken: newRefreshToken,
			},
		});

		return res.status(200).json({ accessToken: newAccessToken });
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return res
				.status(401)
				.json({ error: "Refresh token expired. Please login again." });
		}
		return res.status(403).json({ error: "Invalid refresh token" });
	}
};
