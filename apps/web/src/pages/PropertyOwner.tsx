import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { toast } from "sonner";
import { BadgeCheck, X, Badge, ArrowDown, MessageCircle } from "lucide-react";
import PropertyCard from "../components/cards/PropertyCard";
import { AVATAR_PLACEHOLDER_SVG } from "../utils/common";

type OwnerPropertyData = {
	id: string;
	title: string;
	price: number;
	location: string;
	ownerId: string;
	images?: string[];
	status: "AVAILABLE" | "FULL";
	views: number;
	type: string;
	amenities: string[];
	createdAt: string;
	deletedAt: string | null;
	owner: {
		id: string;
		username: string;
		email: string;
		role: "ADMIN" | "OWNER" | "USER";
		createdAt: string;
		avatarUrl?: string;
		bio?: string;
		isVerified: boolean;
		phone?: string;
	};
};

const PropertyOwner = () => {
	const [propertyData, setPropertyData] = useState<OwnerPropertyData[] | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const { id: ownerId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		let isMounted = true;
		const fetchOwnerProperty = async (id?: string) => {
			setLoading(true);
			try {
				const res = await api.get(`/properties/${id}/property`);
				if (!res.data) throw new Error("Something went wrong");
				if (isMounted) setPropertyData(res.data.data);
			} catch (error) {
				console.error("Error fetching owner and property", error);
				toast.error(
					error instanceof Error ? error.message : "Something went wrong",
					{
						icon: <X size={18} />,
						action: {
							label: "Dismiss",
							onClick: () => toast.dismiss(),
						},
					}
				);
			} finally {
				if (isMounted) setLoading(false);
			}
		};
		fetchOwnerProperty(ownerId);
		return () => {
			isMounted = false;
		};
	}, [ownerId]);

	const landlord = propertyData && propertyData[0]?.owner;

	return (
		<section className="py-10 px-3 sm:px-6 md:px-10 lg:px-14">
			{loading && (
				<div className="flex justify-center items-center min-h-[200px] text-[var(--text-muted)] animate-pulse">
					Loading...
				</div>
			)}

			{!loading && (!propertyData || propertyData.length === 0) && (
				<p className="text-center text-gray-500 mt-20 text-lg">
					No properties found.
				</p>
			)}

			{!loading && propertyData && propertyData.length > 0 && (
				<div className="flex flex-col gap-10">
					<div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-between items-stretch gap-5 mb-6">
						<div className="w-full sm:w-1/2">
							<img
								src={landlord?.avatarUrl || AVATAR_PLACEHOLDER_SVG}
								alt={landlord?.username || "Owner"}
								className="rounded-2xl object-cover aspect-[4/3] w-full shadow-md border border-[var(--highlight)]"
							/>
						</div>

						<div className="space-y-3 bg-[var(--bg-light)] p-6 rounded-2xl shadow-md border border-[var(--highlight)] w-full md:w-1/3">
							<h2 className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
								{landlord?.username}
								{landlord?.isVerified ? (
									<BadgeCheck size={18} color="white" fill="#0f74c5" />
								) : (
									<Badge size={16} color="#5c6670" />
								)}
							</h2>
							<p className="text-sm text-[var(--text-muted)] italic">
								{landlord?.email}
							</p>
							<p className="text-sm text-[var(--text-muted)]">
								{landlord?.phone || "—"}
							</p>
							<p className="rounded-full text-xs font-medium w-fit px-3 py-1 border border-[var(--info)] text-[var(--info)] bg-[var(--bg-lightest)]">
								{landlord?.role.toLowerCase()}
							</p>
							<p className="text-sm leading-relaxed text-[var(--text-secondary)]">
								{landlord?.bio || "No bio available."}
							</p>
							<p className="text-sm text-[var(--text-muted)]">
								Joined on{" "}
								{landlord?.createdAt ? landlord.createdAt.split("T")[0] : "-"}
							</p>
							<p
								onClick={() =>
									navigate(`/owner/messaging?owner=${landlord?.id}`)
								}
								className="flex items-center justify-center gap-1 rounded-full bg-[var(--primary)] w-fit px-3 py-1 text-white font-bold cursor-pointer">
								<MessageCircle size={18} absoluteStrokeWidth />
								<span className="font-bold">Chat</span>
							</p>
						</div>
					</div>

					<h3 className="flex items-center gap-2 text-lg text-[var(--info)] italic underline underline-offset-3 opacity-80">
						{landlord?.username} property
						<ArrowDown size={24} />
					</h3>
					<div className="flex flex-wrap gap-6 justify-center md:justify-start">
						{propertyData.map((p) => (
							<PropertyCard key={p.id} {...p} />
						))}
					</div>
				</div>
			)}
		</section>
	);
};

export default PropertyOwner;
