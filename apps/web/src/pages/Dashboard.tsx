import { useEffect, useState } from "react";
import CreatePropertyModal from "../components/modals/CreatePropertyModal";
import api from "../api";
import { useParams } from "react-router-dom";
import PropertyCard from "../components/cards/PropertyCard";
import { Loader, Plus } from "lucide-react";

type Property = {
	id: string;
	title: string;
	price: number;
	location: string;
	amenities: string[];
	createdAt: string;
	images: string[];
	status: "AVAILABLE" | "FULL";
	type: string;
	deletedAt: string | null;
	views: number;
	ownerId: string;
	owner: {
		id: string;
		username: string;
		email: string;
		role: "ADMIN" | "USER" | "OWNER";
		createdAt: string;
		avatarUrl?: string;
		bio?: string;
		isVerified: boolean;
		phone?: string;
	};
};

const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const { id: ownerId } = useParams();
	const [property, setProperty] = useState<Property[] | null>(null);

	const [fetchingProperty, setFetchingProperty] = useState(true);

	useEffect(() => {
		const fetchProperty = async (id: string | undefined) => {
			try {
				setFetchingProperty(true);
				const result = (await api.get(`/properties/${id}/property`)).data;
				setProperty(result.data);
			} catch (error) {
				console.error("Error fetching properties:", error);
			} finally {
				setFetchingProperty(false);
			}
		};

		fetchProperty(ownerId);
	}, [ownerId]);

	return (
		<div className="min-h-screen flex flex-col py-4 sm:py-6 gap-5">
			<h1 className="text-center text-2xl md:text-3xl font-bold text-[var(--primary)]">
				My Property
			</h1>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="self-end px-2 py-1 border-2 border-[var(--highlight)] rounded-lg cursor-pointer hover:shadow-[var(--highlight)] text-[var(--primary)] font-bold">
				<span className="sm:hidden font-bold">
					<Plus size={20} />
				</span>
				<span className="hidden sm:block">Create Property</span>
			</button>
			{fetchingProperty && (
				<div className="self-center animate-spin text-[var(--primary)]">
					<Loader size={20} />
				</div>
			)}
			{property && property.length === 0 && (
				<p className="my-4 text-[var(--text-muted)] text-center italic">
					You have no property yet.
				</p>
			)}
			<section className="flex flex-wrap justify-center gap-5 my-5">
				{property && property.map((p) => <PropertyCard key={p.id} {...p} />)}
			</section>

			<CreatePropertyModal open={open} close={() => setOpen(false)} />
		</div>
	);
};

export default Dashboard;
