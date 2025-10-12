import { HouseWifi, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
const Navbar = () => {
	const { theme, toggleTheme } = useTheme();
	return (
		<nav className="flex items-center justify-between">
			<div className="">
				<div className="flex items-center gap-2">
					<HouseWifi color="#1481b8" size={32} strokeWidth={2.5} />
					<h1 className="hidden lg:block text-2xl font-semibold antialiased text-[var(--primary)]">
						housekonekt
					</h1>
				</div>
			</div>

			{/* pages */}
			<div>
				<NavLink to="/home">Home</NavLink>
			</div>

			<div>
				<div
					onClick={() => toggleTheme()}
					className="cursor-pointer text-gray-700 dark:text-yellow-400 transition-colors duration-300">
					{theme === "dark" ? (
						<Sun color="currentColor" />
					) : (
						<Moon color="currentColor" />
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
