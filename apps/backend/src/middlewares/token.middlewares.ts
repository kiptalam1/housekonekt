import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { Role } from "../../generated/prisma/client.js";

const isProd = process.env.NODE_ENV === "production";
export const generateAccessTokenAndSetCookie = (
	_req: Request,
	res: Response,
	userId: string,
	role: Role
): string => {
	if (!process.env.ACCESS_SECRET) {
		throw new Error("ACCESS_SECRET not defined");
	}
	const token = jwt.sign({ userId, role }, process.env.ACCESS_SECRET, {
		expiresIn: "15m",
	});

	res.cookie("accessToken", token, {
		httpOnly: true,
		sameSite: isProd ? "strict" : "none",
		secure: isProd,
		maxAge: 15 * 60 * 1000,
		partitioned: true,
	});

	return token;
};
