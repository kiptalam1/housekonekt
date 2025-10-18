import { checkSchema } from "express-validator";

export const validatePropertyCreationInput = checkSchema({
	title: {
		trim: true,
		notEmpty: {
			errorMessage: "Please name your property",
		},
	},
	price: {
		toFloat: true,
		notEmpty: {
			errorMessage: "Enter the price",
		},
		isFloat: {
			errorMessage: "Price must be a valid number",
			options: { min: 0 },
		},
	},
	location: {
		trim: true,
		notEmpty: {
			errorMessage: "Enter location of property",
		},
	},
	units: {
		toInt: true,
		notEmpty: {
			errorMessage: "Enter the number of units in the property",
		},
		isInt: {
			errorMessage: "Units must be a number",
		},
	},
	description: {
		trim: true,
		notEmpty: {
			errorMessage: "Describe your property",
		},
		isLength: {
			options: {
				min: 3,
				max: 2000,
			},
			errorMessage: "Description must be between 3-2000 characters long",
		},
	},
	type: {
		trim: true,
		notEmpty: {
			errorMessage: "Select the property type",
		},
		isIn: {
			options: [
				[
					"BEDSITTER",
					"STUDIO",
					"ONE_BEDROOM",
					"TWO_BEDROOM",
					"THREE_BEDROOM",
					"MAISONETTE",
					"TOWNHOUSE",
					"BUNGALOW",
					"SERVICED_APARTMENT",
					"VILLA",
				],
			],
			errorMessage: "Invalid property type",
		},
	},
	amenities: {
		notEmpty: {
			errorMessage:
				"List the amenities available in your property e.g., parking ",
		},
		customSanitizer: {
			options: (value) =>
				Array.isArray(value)
					? value
					: value.split(",").map((v: string) => v.trim()),
		},
	},
	status: {
		trim: true,
		notEmpty: {
			errorMessage: "Status cannot be empty",
		},
		isIn: {
			options: [["AVAILABLE", "FULL"]],
			errorMessage: "Status must be either AVAILABLE or FULL",
		},
	},
});

export const validatePropertyUpdateInput = checkSchema({
	title: {
		optional: true,
		trim: true,
		notEmpty: {
			errorMessage: "Please name your property",
		},
	},

	price: {
		optional: true,
		toFloat: true,
		notEmpty: {
			errorMessage: "Enter the price",
		},
		isFloat: {
			errorMessage: "Price must be a valid number",
			options: { min: 0 },
		},
	},
	location: {
		optional: true,
		trim: true,
		notEmpty: {
			errorMessage: "Enter location of property",
		},
	},
	units: {
		optional: true,
		toInt: true,
		notEmpty: {
			errorMessage: "Enter the number of units in the property",
		},
		isInt: {
			errorMessage: "Units must be a number",
		},
	},
	description: {
		optional: true,
		trim: true,
		notEmpty: {
			errorMessage: "Describe your property",
		},
		isLength: {
			options: {
				min: 3,
				max: 2000,
			},
			errorMessage: "Description must be between 3-2000 characters long",
		},
	},
	type: {
		optional: true,
		trim: true,
		notEmpty: {
			errorMessage: "Select the property type",
		},
		isIn: {
			options: [
				[
					"BEDSITTER",
					"STUDIO",
					"ONE_BEDROOM",
					"TWO_BEDROOM",
					"THREE_BEDROOM",
					"MAISONETTE",
					"TOWNHOUSE",
					"BUNGALOW",
					"SERVICED_APARTMENT",
					"VILLA",
				],
			],
			errorMessage: "Invalid property type",
		},
	},
	amenities: {
		optional: true,
		notEmpty: {
			errorMessage:
				"List the amenities available in your property e.g., parking ",
		},
		customSanitizer: {
			options: (value) =>
				Array.isArray(value)
					? value
					: value.split(",").map((v: string) => v.trim()),
		},
	},
	status: {
		optional: true,
		trim: true,
		notEmpty: {
			errorMessage: "Status cannot be empty",
		},
		isIn: {
			options: [["AVAILABLE", "FULL"]],
			errorMessage: "Status must be either AVAILABLE or FULL",
		},
	},
});