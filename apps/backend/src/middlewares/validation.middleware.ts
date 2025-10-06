import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
export const handleValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
): Response | void => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMsg = errors.array().map((err) => err.msg)[0];
		return res.status(400).json({ error: errorMsg });
	}
	next();
};
