import { AxiosError } from "axios";
import api from "../api";
import { toast } from "sonner";

export const registerUser = async (data: {
	username: string;
	email: string;
	password: string;
	role: string;
}) => {
	try {
		const res = (await api.post("/auth/register", data)).data;
		toast.success(res.message || "Account created successfully");
		return true;
	} catch (error) {
		console.error("Error in registerUser", error);
		if (error instanceof AxiosError) {
			const message =
				error.response?.data.error ||
				error.response?.data.message ||
				error.message ||
				"Failed to create your account";
			toast.error(message);
		} else if (error instanceof Error) {
			toast.error(error.message);
		} else {
			toast.error("Failed to create your account");
		}
		return false;
	}
};
