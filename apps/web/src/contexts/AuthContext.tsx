import {
	createContext,
	useCallback,
	useEffect,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";
import { toast } from "sonner";
import api from "../api";
import { AxiosError } from "axios";

export type UserType = {
	id: string;
	username: string;
	email: string;
	role: "ADMIN" | "USER" | "OWNER";
	avatarUrl?: string;
	bio?: string;
	isVerified: boolean;
	lastLogin: string;
	phone?: string;
	createdAt: string;
	updatedAt?: string;
	refreshToken?: string;
};

type AuthTypes = {
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
	setUser: Dispatch<SetStateAction<UserType | null>>;
	user: UserType | null;
	loginUser: (formData: {
		email: string;
		password: string;
	}) => Promise<boolean | void>;
	logout: () => Promise<boolean | void>;
	refreshUser: () => Promise<UserType | void>;
};

export const AuthContext = createContext<AuthTypes | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserType | null>(null);
	const [loading, setLoading] = useState(false);

	const loginUser = async (formData: { email: string; password: string }) => {
		try {
			setLoading(true);

			const res = (await api.post("/auth/login", formData)).data;
			if (!res || !res.user) throw new Error(res?.error || "Failed to log in");

			setUser(res.user);
			toast.success(res.message || "Logged in successfully");
			return true;
		} catch (error) {
			console.error("Error in loginUser", error);
			toast.error(
				error instanceof AxiosError
					? error?.response?.data.error
					: error instanceof Error
					? error.message
					: "Failed to log in"
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			setLoading(true);
			const res = (await api.post("/auth/logout")).data;
			if (!res) throw new Error("Something went wrong. Try again");
			setUser(null);
			toast.success(res.message || "Logged out successfully");
			return true;
		} catch (error) {
			console.error("Error in logout", error);
			if (error instanceof AxiosError) {
				const message =
					error.response?.data.error ||
					error.response?.data.message ||
					error.message ||
					"Failed to log out";
				toast.error(message);
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to logout");
			}

			return false;
		} finally {
			setLoading(false);
		}
	};

	// fetch me;
	const refreshUser = useCallback(async () => {
		try {
			const { data } = await api.get("/users/me");
			setUser(data.data.user);
		} catch (err) {
			console.error("refreshUser failed", err);
		}
	}, []);

	// silently auto-refresh token;
	const refreshToken = async () => {
		try {
			const res = (await api.post("/auth/refresh-token")).data;
			if (res?.user) {
				setUser(res.user);
			}
			return true;
		} catch (error) {
			if (import.meta.env.DEV)
				console.warn("silent token refresh failed", error);
			return false;
		}
	};

	// check if session exists once on mount;
	useEffect(() => {
		const init = async () => {
			await refreshToken(); // this auto logs in if refresh-token is present;
			await refreshUser();
			setLoading(false);
		};
		init();
	}, [refreshUser]);

	useEffect(() => {
		if (!user) return;
		const interval = setInterval(() => {
			refreshToken();
		}, 10 * 60 * 1000);
		return () => clearInterval(interval);
	}, [user]);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				setLoading,
				setUser,
				loginUser,
				logout,
				refreshUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
