import { Prisma, type Property } from "@prisma/client";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middlewares.js";
import {
	PrismaClient,
	PropertyType,
	Status,
} from "@prisma/client";
import cloudinary from "../configs/cloudinary.configs.js";

const prisma = new PrismaClient();

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
		const formattedAmenities =
			amenities && Array.isArray(amenities)
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
		console.error(
			"Error in createProperty:",
			error instanceof Error ? error.stack : error
		);
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
	search?: string;
};

export const getAllProperty = async (
	req: Request<{}, {}, {}, PropertyQueryTypes> & AuthenticatedRequest,
	res: Response
): Promise<Response | void> => {
	try {
		const { page, limit, location, type, minPrice, maxPrice, status, search } =
			req.query;
		const pageNum = parseInt(page ?? "1", 10);
		const limitNum = parseInt(limit ?? "20", 10);
		const skip = (pageNum - 1) * limitNum;

		type PropertyWithOptionalRank = Property & { rank?: number };
		if (search && search.trim() !== "") {
			const searchTerm = search.trim();

			let property: PropertyWithOptionalRank[] = await prisma.$queryRaw<
				PropertyWithOptionalRank[]
			>`
  SELECT "id", "title", "price", "location", "units", "ownerId",
        "amenities", "createdAt", "description", "images",
        "status", "updatedAt", "views", "type", "deletedAt",
        ts_rank_cd(search_vector, plainto_tsquery('english', ${searchTerm})) AS rank
  FROM "Property"
  WHERE search_vector @@ plainto_tsquery('english', ${searchTerm})
  ORDER BY rank DESC, "status" ASC, "createdAt" DESC
  LIMIT ${limitNum} OFFSET ${skip}`;

			// 2️⃣ Fallback: use 'ILIKE' when FTS yields zero results
			if (!property || property.length === 0) {
				property = await prisma.property.findMany({
					where: {
						OR: [
							{ title: { contains: searchTerm, mode: "insensitive" } },
							{ location: { contains: searchTerm, mode: "insensitive" } },
							{ description: { contains: searchTerm, mode: "insensitive" } },
						],
					},
					orderBy: [{ status: "asc" }, { createdAt: "desc" }],
					skip,
					take: limitNum,
				});
			}

			return res.status(200).json({
				meta: { page: pageNum, skip, limit: limitNum, totalPages: null },
				data: property,
			});
		}

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
			include: {
				owner: {
					select: {
						username: true,
						id: true,
					},
				},
			},
			omit: {
				updatedAt: true,
			},
			orderBy: [
				{
					deletedAt: { sort: "asc", nulls: "first" },
				},
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
		console.error(
			"Error fetching all property:",
			error instanceof Error ? error.stack : error
		);
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
		console.error(
			"Error fetching single property listing:",
			error instanceof Error ? error.stack : error
		);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const softDeleteProperty = async (
	req: AuthenticatedRequest & Request<{ id: string }>,
	res: Response
): Promise<Response | void> => {
	const { id: propertyId } = req.params;
	const userId = req.user?.userId as string;
	const role = req.user?.role;
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
			},
		});

		if (!property || property.deletedAt) {
			return res.status(404).json({ error: "This property no longer exists" });
		}
		//  only allow owners or admin to delete property;
		if (property.ownerId !== userId && role !== "ADMIN") {
			return res
				.status(403)
				.json({ error: "You are not authorized to delete this property" });
		}
		// allow delete if property belongs to current user or user is admin;
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
		console.error(
			"Error in deleteProperty:",
			error instanceof Error ? error.stack : error
		);
		return res.status(500).json({ error: "Internal server error" });
	}
};

type InputUpdateTypes = Partial<PropertyInput> & {
	images?: string[];
};

export const updateProperty = async (
	req: AuthenticatedRequest & Request<{ id: string }>,
	res: Response
): Promise<Response> => {
	const userId = req.user?.userId as string;
	const role = req.user?.role;
	const { id: propertyId } = req.params;

	try {
		const {
			title,
			price,
			location,
			units,
			description,
			type,
			amenities,
			status,
		}: InputUpdateTypes = req.body;

		// verify user
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true },
		});
		if (!user)
			return res.status(404).json({ error: "User not found. Please log in" });

		// verify property ownership
		const property = await prisma.property.findUnique({
			where: { id: propertyId },
		});
		if (!property || (property.ownerId !== userId && role !== "ADMIN"))
			return res
				.status(404)
				.json({ error: "This property does not exist or you do not own it" });

		// handle new images
		let imageUrls: string[] = [];

		if (req.files && Array.isArray(req.files) && req.files.length > 0) {
			const files = req.files as Express.Multer.File[];

			// upload concurrently
			imageUrls = await Promise.all(
				files.map((file) => {
					if (!file.buffer)
						return Promise.reject(new Error("Missing file buffer"));
					return new Promise<string>((resolve, reject) => {
						const stream = cloudinary.uploader.upload_stream(
							{ folder: "properties" },
							(err, result) => {
								if (err) return reject(err);
								if (!result?.secure_url)
									return reject(new Error("No secure_url returned"));
								resolve(result.secure_url);
							}
						);
						stream.end(file.buffer);
					});
				})
			);
		}

		// handle removed/retained images;
		let existingImages: string[] = [];
		if (req.body.existingImages) {
			existingImages = Array.isArray(req.body.existingImages)
				? req.body.existingImages
				: [req.body.existingImages];
		}
		const finalImages = [...existingImages, ...imageUrls];

		const formattedAmenities =
			Array.isArray(amenities) && amenities.length
				? amenities
				: typeof amenities === "string"
				? amenities.split(",").map((a) => a.trim())
				: [];

		const data: Prisma.PropertyUpdateInput = {};

		if (title) data.title = title;
		if (description) data.description = description;
		if (location) data.location = location;
		if (price) data.price = Number(price);
		if (status) data.status = status;
		if (type) data.type = type;
		if (units) data.units = Number(units);
		if (formattedAmenities.length) data.amenities = formattedAmenities;
		if (finalImages.length) data.images = finalImages;

		const updatedProperty = await prisma.property.update({
			where: { id: propertyId },
			data,
		});

		return res.json({
			message: "Property updated successfully",
			property: updatedProperty,
		});
	} catch (error) {
		console.error("Error in updateProperty:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getPropertyByOwner = async (
	req: Request<{ id: string }> & AuthenticatedRequest,
	res: Response
): Promise<Response | void> => {
	const { id: ownerId } = req.params;

	try {
		// check if owner exists;
		const owner = await prisma.user.findUnique({
			where: { id: ownerId },
			omit: { password: true },
		});

		if (!owner) {
			return res.status(404).json({
				error: "This owner no longer exists",
			});
		}

		const property = await prisma.property.findMany({
			where: {
				ownerId,
				deletedAt: null,
			},
			orderBy: [
				{
					createdAt: "desc",
				},
				{
					status: "asc",
				},
			],

			include: {
				owner: {
					omit: {
						password: true,
						refreshToken: true,
						lastLogin: true,
						updatedAt: true,
					},
				},
			},
		});

		return res.status(200).json({
			data: property,
		});
	} catch (error) {
		console.error(
			"Error getting owner's property:",
			error instanceof Error ? error.stack : error
		);
		return res.status(500).json({ error: "Internal server error" });
	}
};
