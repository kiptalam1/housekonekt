import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
	user?:
		| {
				userId: string;
				role: string;
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
