import bcrypt from "bcrypt";

export const hashUserPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 12);
};
