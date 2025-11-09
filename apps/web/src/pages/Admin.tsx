import { useState,  } from "react";
import { useAuth } from "../hooks/useAuth";
import AdminProperty from "../components/admin/AdminProperty";

const Admin = () => {
	const { user } = useAuth();

	const options = ["Properties", "All users", "Owners"];
	const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

	function handleClick(index: number) {
		setSelectedIndex(index);
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
							selectedIndex === index ? "rounded-lg border border-[var(--primary)]" : ""
						}`}>
						{option}
					</div>
				))}
			</div>
			<AdminProperty />
		</div>
	);
};

export default Admin;
