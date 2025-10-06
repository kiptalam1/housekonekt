import { checkSchema } from "express-validator";

export const validateRegistrationFields = checkSchema({
	username: {
		notEmpty: {
			errorMessage: "Provide username",
		},
		isLength: {
			options: {
				min: 3,
				max: 30,
			},
			errorMessage: "Username must be between 3-30 characters long",
		},
	},
	email: {
		notEmpty: {
			errorMessage: "Provide a valid email",
		},
		isEmail: {
			errorMessage: "Enter a valid email",
		},
		normalizeEmail: true,
	},
	password: {
		notEmpty: {
			errorMessage: "Please provide a password",
		},
		isLength: {
			options: { min: 6 },
			errorMessage: "Password must be at least 6 characters long.",
		},
		matches: {
			options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
			errorMessage:
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		},
	},
});
