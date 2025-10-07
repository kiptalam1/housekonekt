import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../generated/prisma/client.js";

export interface AuthenticatedRequest extends Request {
	user?:
		| {
				userId: string;
				role: Role;
				iat?: number;
				exp?: number;
		  }
		| undefined;
}

export const verifyAuthenticationToken = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	const token =
		req.cookies?.accessToken ||
		(req.headers.authorization?.startsWith("Bearer ")
			? req.headers.authorization.split(" ")[1]
			: null);

	if (!token) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		if (!process.env.ACCESS_SECRET) {
			throw new Error("ACCESS_SECRET not defined");
		}
		const decoded = jwt.verify(
			token,
			process.env.ACCESS_SECRET
		) as AuthenticatedRequest["user"];
		req.user = decoded;
		next();
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			return res.status(401).json({
				error: "Session expired. Please login again.",
			});
		}
		return res.status(403).json({
			error: "Invalid authentication token. Please login",
		});
	}
};

export const isAdminOrOwner = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Response | void => {
	const role = req.user?.role;
	if (role !== "ADMIN" && role !== "OWNER") {
		return res.status(403).json({
			message: "Access denied. Only property owners can perform this action.",
		});
	}

	return next();
};