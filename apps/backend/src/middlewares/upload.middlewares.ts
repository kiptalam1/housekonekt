import multer, { memoryStorage, type FileFilterCallback } from "multer";
import { type Request } from "express";

const storage = memoryStorage();

function fileFilter(
	_req: Request,
	file: Express.Multer.File,
	callback: FileFilterCallback
) {
	const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

	if (!allowedTypes.includes(file.mimetype)) {
		return callback(new Error("Only JPEG, PNG, and WEBP images are allowed."));
	}
	callback(null, true);
}

export const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5 MB limit
		files: 6,
	},
	fileFilter,
});
