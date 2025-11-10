import { useState,  } from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet, useNavigate } from "react-router-dom";

const Admin = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const options = [
		{ label: "Properties", path: "/admin" },
		{ label: "All users", path: "/admin/all-users" },
		{ label: "Owners", path: "/admin/owners" },
	];
	const [selectedIndex, setSelectedIndex] = useState(0);

	function handleClick(index: number) {
		setSelectedIndex(index);
		navigate(options[index].path);
	}

	return (
		<div className="min-h-screen flex flex-col py-4 sm:py-6 gap-5">
			<h1 className="text-center text-2xl md:text-3xl font-bold text-[var(--primary)]">
				Welcome {user ? user.username : "admin"}
			</h1>
			{/* toggle */}
			<div className="flex mx-auto items-center justify-center gap-2 bg-[var(--bg-light)] rounded-lg">
				{options.map((option, index) => (
					<div
						key={index}
						onClick={() => handleClick(index)}
						className={`py-2 px-4 cursor-pointer ${
							selectedIndex === index
								? "rounded-lg border border-[var(--primary)]"
								: ""
						}`}>
						{option.label}
					</div>
				))}
			</div>
			<Outlet />
		</div>
	);
};

export default Admin;
