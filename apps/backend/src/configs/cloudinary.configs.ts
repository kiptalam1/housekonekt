import { v2 as cloudinary } from "cloudinary";

type CloudinaryConfigTypes = {
	cloud_name: string;
	api_key: string;
	api_secret: string;
};

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
} as CloudinaryConfigTypes);

export default cloudinary;
