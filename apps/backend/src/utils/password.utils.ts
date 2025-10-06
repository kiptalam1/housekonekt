import bcrypt from "bcrypt";

export const hashUserPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 12);
};

export const comparePasswords = async (password: string, hashed: string) => {
	return await bcrypt.compare(password, hashed);
};