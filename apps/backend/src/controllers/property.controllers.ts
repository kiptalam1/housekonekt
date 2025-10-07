import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middlewares.js";
import {
	PrismaClient,
	PropertyType,
	Status,
} from "../../generated/prisma/client.js";

const prisma = new PrismaClient();
const isDev = process.env.NODE_ENV === "development";

type PropertyInput = {
	title: string;
	price: number;
	location: string;
	units: number;
	description: string;
	// images: string[];
	type:
		| "BEDSITTER"
		| "STUDIO"
		| "ONE_BEDROOM"
		| "TWO_BEDROOM"
		| "THREE_BEDROOM"
		| "MAISONETTE"
		| "TOWNHOUSE"
		| "BUNGALOW"
		| "SERVICED_APARTMENT"
		| "VILLA";
	amenities: string[] | string;
	status: "AVAILABLE" | "FULL";
};

export const createProperty = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<Response> => {
	const {
		title,
		price,
		location,
		units,
		description,
		type,
		amenities,
		status,
	}: PropertyInput = req.body;

	const userId = req.user?.userId as string;

	try {
		// only allow admin and owner to create property;
		// check if the property already exists;
		const property = await prisma.property.findUnique({
			where: {
				title_location_ownerId: {
					title,
					location,
					ownerId: userId,
				},
			},
		});

		if (property) {
			return res.status(400).json({ error: "This property already exists" });
		}

		// else create the property and save to database;
		const formattedAmenities = Array.isArray(amenities)
			? amenities
			: amenities.split(",").map((a) => a.trim());
		const newProperty = await prisma.property.create({
			data: {
				title,
				description,
				location,
				price: Number(price),
				units,
				amenities: formattedAmenities,
				images: [],
				ownerId: userId,
				type: type ?? PropertyType.BEDSITTER,
				status: status ?? Status.AVAILABLE,
			},
		});

		return res.status(201).json({
			message: "Property added successfully",
			property: newProperty,
		});
	} catch (error) {
		if (isDev) {
			console.log("Error in createProperty", error);
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};
