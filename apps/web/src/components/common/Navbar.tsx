import { HouseWifi, Moon, Sun } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
const Navbar = () => {
	const { theme, toggleTheme } = useTheme();
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		const success = await logout();
		if (success) {
			navigate("/auth/login");
		}
	};
	return (
		<nav className="flex items-center justify-between py-4 ">
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
				<NavLink to="/home">Home</NavLink>
				{!user && <NavLink to="/auth/login">Log In</NavLink>}
				{!user && <NavLink to="/auth/register">Sign Up</NavLink>}
				{user && (user.role === "ADMIN" || user.role === "OWNER") && (
					<NavLink to={`/dashboard/${user.id}`}>Dashboard</NavLink>
				)}
				{user && (
					<button
						type="button"
						onClick={handleLogout}
						className="text-red-500 cursor-pointer border border-red-400 rounded-lg px-2 py-1">
						Log out
					</button>
				)}
			</div>

			<div>
				<div
					onClick={() => toggleTheme()}
					className="cursor-pointer text-gray-700 dark:text-yellow-400 transition-colors duration-300">
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
