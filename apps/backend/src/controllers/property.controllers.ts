import { Prisma } from "../../generated/prisma/client.js";
import type { Request, Response } from "express";
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

type PropertyQueryTypes = {
	page?: string;
	limit?: string;
	location?: string;
	type?:
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
	minPrice?: string;
	maxPrice?: string;
	status?: "AVAILABLE" | "FULL";
};

export const getAllProperty = async (
	req: Request<{}, {}, {}, PropertyQueryTypes> & AuthenticatedRequest,
	res: Response
): Promise<Response | void> => {
	try {
		const { page, limit, location, type, minPrice, maxPrice, status } =
			req.query;
		const pageNum = parseInt(page ?? "1", 10);
		const limitNum = parseInt(limit ?? "20", 10);
		const skip = (pageNum - 1) * limitNum;

		const filters: Prisma.PropertyWhereInput = {};

		if (!req.user || req.user?.role !== "ADMIN") {
			filters.deletedAt = null;
		}
		if (location) {
			filters.location = { contains: location, mode: "insensitive" };
		}

		if (type) {
			filters.type = type;
		}
		if (status) {
			filters.status = status;
		}
		if (minPrice || maxPrice) {
			filters.price = {};
			if (minPrice) {
				filters.price.gte = Number(minPrice);
			}
			if (maxPrice) {
				filters.price.lte = Number(maxPrice);
			}
		}

		const property = await prisma.property.findMany({
			skip,
			take: limitNum,
			where: filters,
			omit: {
				ownerId: true,
				updatedAt: true,
				views: true,
				description: true,
				units: true,
			},
			orderBy: [
				{
					status: "asc",
				},
				{
					createdAt: "desc",
				},
			],
		});

		const totalProperty = await prisma.property.count({ where: filters });
		const totalPages = Math.max(1, Math.ceil(totalProperty / limitNum));

		return res.status(200).json({
			meta: {
				page: pageNum,
				skip,
				limit: limitNum,
				totalProperty,
				totalPages,
			},
			data: property,
		});
	} catch (error) {
		if (isDev) {
			console.error("Error fetching all property", error);
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getSinglePropertyListing = async (
	req: Request<{ id: string }> & AuthenticatedRequest,
	res: Response
): Promise<Response> => {
	const { id: propertyId } = req.params;
	const visitorId = req.cookies.visitorId || req.user?.userId;
	try {
		// check if user has viewed this property;
		const existingView = await prisma.propertyView.findFirst({
			where: {
				propertyId,
				visitorId,
			},
		});

		if (!existingView) {
			await prisma.$transaction([
				prisma.propertyView.create({
					data: {
						propertyId,
						visitorId,
					},
				}),
				// increment property view count;
				prisma.property.update({
					where: {
						id: propertyId,
					},
					data: {
						views: { increment: 1 },
					},
				}),
			]);
		}

		const filters: Prisma.PropertyWhereUniqueInput = { id: propertyId };

		if (req.user?.role !== "ADMIN") {
			filters.deletedAt = null;
		}

		const property = await prisma.property.findUnique({
			where: filters,
			omit: {
				updatedAt: true,
			},
			include: {
				owner: {
					omit: {
						password: true,
						role: true,
						lastLogin: true,
						refreshToken: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
		});

		if (!property) {
			return res.status(404).json({
				error: "This property no longer exists",
			});
		}

		return res.status(200).json({
			data: property,
		});
	} catch (error) {
		if (isDev) {
			console.error("Error fetching single property listing", error);
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const softDeleteProperty = async (
	req: AuthenticatedRequest & Request<{ id: string }>,
	res: Response
): Promise<Response | void> => {
	const { id: propertyId } = req.params;
	const userId = req.user?.userId as string;
	try {
		// check if user exists;
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				role: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// check if property exists;
		const property = await prisma.property.findUnique({
			where: {
				id: propertyId,
				ownerId: userId,
				deletedAt: null,
			},
		});

		if (!property) {
			return res.status(404).json({ error: "This property no longer exists" });
		}
		// a middleware will only allow owners or admin to delete property;
		// allow delete if property belongs to current user;
		const propertyDeleted = await prisma.property.update({
			where: {
				id: propertyId,
			},
			data: {
				deletedAt: new Date(),
			},
		});

		return res.status(200).json({
			message: "Property deleted successfully",
			data: propertyDeleted,
		});
	} catch (error) {
		if (isDev) {
			console.error("Error in deleteProperty", error);
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};