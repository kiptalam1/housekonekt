import { useState } from "react";
import CreatePropertyModal from "../components/modals/CreatePropertyModal";

const Dashboard = () => {
	const [open, setOpen] = useState(true);

	return (
		<div className="min-h-screen flex flex-col py-4 sm:py-6 gap-5">
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="self-end px-2 py-1 border-2 border-[var(--highlight)] rounded-lg cursor-pointer hover:shadow-[var(--highlight)] text-[var(--primary)] font-bold">
				Create Property
			</button>
			<CreatePropertyModal open={open} close={() => setOpen(false)} />
		</div>
	);
};

export default Dashboard;
