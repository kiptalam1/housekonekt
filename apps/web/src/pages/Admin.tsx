import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import api from "../api";
import type { Property } from "../utils/common";

type User = {
	id: string;
	username: string;
	email: string;
	role: "ADMIN" | "USER" | "OWNER";
	isVerified: boolean;
	phone: string | null;
	bio: string | null;
	lastLogin: string | null;
	createdAt: string;
	deletedAt: string | null;
	avatarUrl: string | null;
	_count: {
		sentMessages: number;
		receivedMessages: number;
		properties: number;
	};
};

type Stats = {
	properties: number;
	all_users: number;
	owners: number;
};

export type AdminOutletContext = {
	users: User[] | null;
	properties: Property[] | null;
	loadingUsers: boolean;
	loadingProperties: boolean;
	handleStatsUpdate: (newCounts: Partial<Stats>) => void;
	setProperties: React.Dispatch<React.SetStateAction<Property[]>>
};

const Admin = () => {
	const [stats, setStats] = useState<Stats>({
		properties: 0,
		all_users: 0,
		owners: 0,
	});
	const [users, setUsers] = useState<User[] | null>(null);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [loadingProperties, setLoadingProperties] = useState(false);
	const [properties, setProperties] = useState<Property[] | null>(null);

	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const options = useMemo(() => {
		return [
			{ label: "Properties", path: "/admin" },
			{ label: "All users", path: "/admin/all-users" },
			{ label: "Owners", path: "/admin/owners" },
		];
	}, []);
	const [selectedIndex, setSelectedIndex] = useState(0);

	// sync the selectedIndex with the current url;
	useEffect(() => {
		const current = options.findIndex((opt) => location.pathname === opt.path);
		setSelectedIndex(current !== -1 ? current : 0);
	}, [location.pathname, options]);

	function handleClick(index: number) {
		setSelectedIndex(index);
		navigate(options[index].path);
	}

	// fetch all users from backend api;
	useEffect(() => {
		const fetchAllUsers = async () => {
			setLoadingUsers(true);
			try {
				const res = (await api.get("/users/all-users")).data;
				if (!res) throw new Error(res.error || "Failed to load users");

				setUsers(res.data);
				handleStatsUpdate({
					all_users: res.data.length,
					owners: res.data.filter((u: User) => u.role === "OWNER").length,
				});
			} catch (error) {
				console.error("Error fetching users", error);
				toast.error(
					error instanceof AxiosError
						? error.response?.data.error
						: error instanceof Error
						? error.message
						: "Something went wrong."
				);
			} finally {
				setLoadingUsers(false);
			}
		};

		fetchAllUsers();
	}, []);

	// fetch all properties from backend api;
	useEffect(() => {
		const fetchAllProperties = async () => {
			setLoadingProperties(true);
			try {
				const res = (await api.get("/properties")).data;
				if (!res) throw new Error(res.error || "Failed to load properties");

				setProperties(res.data);
				handleStatsUpdate({ properties: res.data.length });
			} catch (error) {
				console.error("Error fetching properties", error);
				toast.error(
					error instanceof AxiosError
						? error.response?.data.error
						: error instanceof Error
						? error.message
						: "Something went wrong."
				);
			} finally {
				setLoadingProperties(false);
			}
		};

		fetchAllProperties();
	}, []);

	function handleStatsUpdate(newCounts: Partial<Stats>) {
		setStats((prev) => {
			const updated = { ...prev, ...newCounts };
			localStorage.setItem("adminStats", JSON.stringify(updated));
			return updated;
		});
	}

	return (
		<div className="min-h-screen flex flex-col py-4 sm:py-6 gap-5 overflow-x-auto">
			<h1 className="text-center text-2xl md:text-3xl font-bold text-[var(--primary)]">
				Welcome {user?.username || "admin"}
			</h1>
			{/* toggle */}
			<div className="flex mx-auto items-center justify-center gap-2 bg-[var(--bg-light)] rounded-lg ">
				{options.map((option, index) => (
					<div
						key={index}
						onClick={() => handleClick(index)}
						className={`relative py-2 px-4 cursor-pointer ${
							selectedIndex === index
								? "rounded-lg border border-[var(--primary)]"
								: ""
						}`}>
						{option.label}
						<span className="absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center bg-[var(--primary)] text-white text-sm">
							{stats[
								option.label.toLowerCase().replace(" ", "_") as keyof Stats
							] || 0}
						</span>
					</div>
				))}
			</div>
			<Outlet
				context={{
					users,
					loadingUsers,
					loadingProperties,
					properties,
					handleStatsUpdate,
					setProperties,
				}}
			/>
		</div>
	);
};

export default Admin;
