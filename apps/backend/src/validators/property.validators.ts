import { checkSchema } from "express-validator";

export const validatePropertyCreationInput = checkSchema({
	title: {
		notEmpty: {
			errorMessage: "Please name your property",
		},
	},
	price: {
		notEmpty: {
			errorMessage: "Enter the price",
		},
		isFloat: {
			errorMessage: "Price must be a valid number",
			options: { min: 0 },
		},
	},
	location: {
		notEmpty: {
			errorMessage: "Enter location of property",
		},
	},
	units: {
		notEmpty: {
			errorMessage: "Enter the number of units in the property",
		},
		isInt: {
			errorMessage: "Units must be a number",
		},
	},
	description: {
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
	},
	status: {
		notEmpty: {
			errorMessage: "Status cannot be empty",
		},
		isIn: {
			options: [["AVAILABLE", "FULL"]],
			errorMessage: "Status must be either AVAILABLE or FULL",
		},
	},
});
