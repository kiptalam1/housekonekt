import type { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

// error-handling middleware
export function multerErrorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	if (err instanceof MulterError) {
		let message = "";
		switch (err.code) {
			case "LIMIT_FILE_SIZE":
				message = "File too large. Maximum allowed size is 5MB.";
				break;
			case "LIMIT_UNEXPECTED_FILE":
				message = "Too many files uploaded.";
				break;
			default:
				message = err.message;
		}
		return res.status(400).json({ error: message });
	}

	if (err instanceof Error) {
		return res.status(400).json({ error: err.message });
	}

	// fallback for unknown errors
	console.error("Unhandled error:", err);
	return res.status(500).json({ error: "Internal server error" });
}
