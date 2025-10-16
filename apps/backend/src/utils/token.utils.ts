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
		sameSite: isProd ? "none" : "lax",
		secure: isProd,
		maxAge: 15 * 60 * 1000,
		partitioned: isProd,
	});

	return token;
};

export const generateRefreshTokenAndSetCookie = (
	_req: Request,
	res: Response,
	userId: string,
	role: Role
): string => {
	if (!process.env.REFRESH_SECRET) {
		throw new Error("REFRESH_SECRET not defined");
	}

	const refreshToken = jwt.sign({ userId, role }, process.env.REFRESH_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		sameSite: isProd ? "none" : "lax",
		secure: isProd,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		partitioned: isProd,
	});

	return refreshToken;
};