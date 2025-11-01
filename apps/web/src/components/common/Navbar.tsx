import { HouseWifi, Menu, Moon, Sun, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import type { UserType } from "../../contexts/AuthContext";
import type { Theme } from "../../contexts/ThemeContext";

function MobileMenu({
	open,
	onClose,
	onLogout,
	user,
	onToggle,
	theme,
}: {
	open: boolean;
	onClose: () => void;
	onLogout: () => void;
	user: UserType | null;
	onToggle: () => void;
	theme: Theme;
}) {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [open]);

	// if (!open) return null;

	return (
		<div
			onClick={(e) => {
				e.stopPropagation();
				onClose();
			}}
			className={`fixed sm:hidden z-10 inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300
			${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
			<div
				className={`w-[250px] h-full bg-[var(--bg-light)] flex flex-col gap-2 p-4 transform rounded-lg  transition-transform duration-300 ease-in-out ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}>
				<NavLink
					to="/home"
					onClick={onClose}
					className={({ isActive }) =>
						isActive
							? "text-[var(--primary)] font-bold text-lg"
							: "text-base hover:bg-[var(--bg)] p-2 rounded-lg"
					}>
					Home
				</NavLink>
				{!user && (
					<NavLink
						to="/auth/login"
						onClick={onClose}
						className={({ isActive }) =>
							isActive
								? "text-[var(--primary)] font-bold text-lg"
								: "text-base hover:bg-[var(--bg)] p-2 rounded-lg"
						}>
						Log In
					</NavLink>
				)}
				{!user && (
					<NavLink
						to="/auth/register"
						onClick={onClose}
						className={({ isActive }) =>
							isActive
								? "text-[var(--primary)] font-bold text-lg"
								: "text-base hover:bg-[var(--bg)] p-2 rounded-lg"
						}>
						Sign Up
					</NavLink>
				)}
				{user && (user.role === "ADMIN" || user.role === "OWNER") && (
					<NavLink
						to={`/dashboard/${user.id}`}
						onClick={onClose}
						className={({ isActive }) =>
							isActive
								? "text-[var(--primary)] font-bold text-lg"
								: "text-base hover:bg-[var(--bg)] p-2 rounded-lg"
						}>
						Dashboard
					</NavLink>
				)}
				{user && (
					<NavLink
						to={`/owner/messaging`}
						className={({ isActive }) =>
							isActive
								? "text-[var(--primary)] font-bold text-lg"
								: "text-base hover:bg-[var(--bg)] p-2 rounded-lg"
						}>
						Chats
					</NavLink>
				)}
				{user && (
					<NavLink
						to={"/user/me"}
						onClick={onClose}
						className={({ isActive }) =>
							isActive
								? "text-[var(--primary)] font-bold text-lg"
								: "text-base hover:bg-[var(--bg)] p-2 rounded-lg"
						}>
						My Profile
					</NavLink>
				)}
				{user && (
					<button
						type="button"
						onClick={onLogout}
						className="w-fit text-red-500 cursor-pointer border border-red-400 rounded-lg px-2 py-1 mt-3">
						Log out
					</button>
				)}
				<div
					onClick={onToggle}
					className="cursor-pointer text-gray-700 dark:text-yellow-400 transition-colors duration-300 mt-5 p-2 rounded">
					{theme === "dark" ? (
						<Sun size={20} color="currentColor" />
					) : (
						<Moon size={20} color="currentColor" />
					)}
				</div>
			</div>
		</div>
	);
}

const Navbar = () => {
	const { theme, toggleTheme } = useTheme();
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = async () => {
		const success = await logout();
		if (success) {
			navigate("/auth/login");
		}
	};
	return (
		<nav className="flex items-center justify-between py-4 relative">
			<div className="">
				<div
					onClick={() => navigate("/")}
					className="flex items-center gap-2 cursor-pointer">
					<HouseWifi color="#1481b8" size={32} strokeWidth={2.5} />
					<h1 className="hidden lg:block text-2xl font-semibold antialiased text-[var(--primary)]">
						housekonekt
					</h1>
				</div>
			</div>

			{/* pages */}
			<div className="flex items-center justify-between gap-6">
				<button
					type="button"
					aria-label="menu"
					className="top-2 right-0 sm:hidden justify-end absolute z-20 cursor-pointer"
					onClick={() => setMenuOpen(!menuOpen)}>
					{menuOpen ? (
						<X
							size={26}
							color="#c32222"
							className="ring ring-[var(--danger)] rounded-lg"
						/>
					) : (
						<Menu size={26} />
					)}
				</button>

				<MobileMenu
					open={menuOpen}
					onClose={() => setMenuOpen(false)}
					onLogout={handleLogout}
					user={user}
					onToggle={() => toggleTheme()}
					theme={theme}
				/>

				<NavLink
					to="/home"
					className={({ isActive }) =>
						`hidden sm:block transition-all duration-200 ${
							isActive
								? "text-[var(--primary)] font-bold text-xl underline underline-offset-2"
								: "text-base hover:text-[var(--primary)]"
						}`
					}>
					Home
				</NavLink>

				{!user && (
					<NavLink
						to="/auth/login"
						className={({ isActive }) =>
							`hidden sm:block transition-all duration-200 ${
								isActive
									? "text-[var(--primary)] font-bold text-xl underline underline-offset-2"
									: "text-base hover:text-[var(--primary)]"
							}`
						}>
						Log In
					</NavLink>
				)}
				{!user && (
					<NavLink
						to="/auth/register"
						className={({ isActive }) =>
							`hidden sm:block transition-all duration-200 ${
								isActive
									? "text-[var(--primary)] font-bold text-xl underline underline-offset-2"
									: "text-base hover:text-[var(--primary)]"
							}`
						}>
						Sign Up
					</NavLink>
				)}
				{user && (user.role === "ADMIN" || user.role === "OWNER") && (
					<NavLink
						to={`/dashboard/${user.id}`}
						className={({ isActive }) =>
							`hidden sm:block transition-all duration-200 ${
								isActive
									? "text-[var(--primary)] font-bold text-xl underline underline-offset-2"
									: "text-base hover:text-[var(--primary)]"
							}`
						}>
						Dashboard
					</NavLink>
				)}
				{user && (
					<NavLink
						to={`/owner/messaging`}
						className={({ isActive }) =>
							`hidden sm:block transition-all duration-200 ${
								isActive
									? "text-[var(--primary)] font-bold text-xl underline underline-offset-2"
									: "text-base hover:text-[var(--primary)]"
							}`
						}>
						Chats
					</NavLink>
				)}
				{user && (
					<NavLink
						to={"/user/me"}
						className={({ isActive }) =>
							`hidden sm:block transition-all duration-200 ${
								isActive
									? "text-[var(--primary)] font-bold text-xl underline underline-offset-2"
									: "text-base hover:text-[var(--primary)]"
							}`
						}>
						My Profile
					</NavLink>
				)}
				{user && (
					<button
						type="button"
						onClick={handleLogout}
						className="hidden sm:block text-red-500 cursor-pointer border border-red-400 rounded-lg px-2 py-1">
						Log out
					</button>
				)}
			</div>

			<div>
				<div
					onClick={() => toggleTheme()}
					className="hidden sm:block cursor-pointer text-gray-700 dark:text-yellow-400 transition-colors duration-300">
					{theme === "dark" ? (
						<Sun size={20} color="currentColor" />
					) : (
						<Moon size={20} color="currentColor" />
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
