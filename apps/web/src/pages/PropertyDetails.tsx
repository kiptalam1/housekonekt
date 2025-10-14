import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import type { Property } from "../components/cards/PropertyCard";
import { toast } from "sonner";
import { Badge, BadgeCheck, Calendar, Eye, X } from "lucide-react";
import PropertyDetailsSkeleton from "../components/skeletons/PropertyDetailsSkeleton";

const AVATAR_PLACEHOLDER_SVG =
	"data:image/svg+xml;utf8," +
	encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <circle cx="64" cy="48" r="24" fill="#d1d5db"/>
  <path d="M16 112c0-22.09 19.91-40 48-40s48 17.91 48 40" fill="#e5e7eb"/>
  <text x="50%" y="122" font-family="Inter,Arial" font-size="10" font-weight="600" fill="#9ca3af" text-anchor="middle">
    No Image
  </text>
</svg>`);

type PropertyDetails = Property & {
	units: number;
	ownerId: string;
	description: string;
	views: number;
	owner: {
		id: string;
		username: string;
		email: string;
		avatarUrl: string | null;
		bio: string | null;
		isVerified: boolean;
		phone: string | null;
	};
};

const PropertyDetails = () => {
	const [property, setProperty] = useState<PropertyDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const { id: propertyId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProperty = async (id: string | undefined) => {
			if (!id) return;
			setLoading(true);

			try {
				const res = await api.get(`/properties/${id}`);
				// console.log("result", result.data.data);
				if (res.data.error) {
					throw new Error(res.data.error || "Failed to load property.");
				}
				setProperty(res.data.data);
			} catch (error: unknown) {
				console.warn("Error fetching single property", error);
				toast.error(
					error instanceof Error
						? error.message
						: "Something went wrong. Reload",
					{
						icon: <X size={18} />,
						action: {
							label: "Dismiss",
							onClick: () => toast.dismiss(),
						},
					}
				);
			} finally {
				setLoading(false);
			}
		};

		fetchProperty(propertyId);
	}, [propertyId]);

	const formattedDate =
		property &&
		new Date(property.createdAt.split("T")[0]).toLocaleDateString("en-US", {
			dateStyle: "medium",
		});

	return (
		<section className="py-8 sm:px-6 md:px-8 lg:p-10 flex flex-col items-center">
			{loading && <PropertyDetailsSkeleton />}
			{!loading && property && (
				<div className="w-full max-w-6xl mx-auto space-y-3">
					{/* title */}
					<h2 className="text-2xl font-semibold ml-4 sm:ml-12 md:ml-24 lg:32">
						{property?.title}
					</h2>
					{/* images */}
					<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,300px))] gap-2 justify-center">
						{property.images &&
							property.images.length > 0 &&
							property.images.map((image, idx) => (
								<img
									key={idx}
									src={image}
									alt={`Property image ${idx + 1}`}
									className="w-full max-w-[300px] h-48 sm:h-52 object-cover rounded-lg"
								/>
							))}
					</div>

					{/* description */}
					<div className="ml-4 sm:ml-12 md:ml-24 lg:32 mt-6">
						<h3 className="text-[var(--text-muted)] font-semibold italic text-sm">
							Description:
						</h3>
						<p>{property.description}</p>
					</div>

					{/* amenities */}
					<div className="ml-4 sm:ml-12 md:ml-24 lg:32 mt-6">
						<h4 className="font-semibold text-[var(--text-muted)] italic text-sm">
							Amenities provided are:
						</h4>
						<ul className="">
							{property.amenities?.map((a, i) => (
								<li key={i} className="ml-1">
									{" "}
									&#10003; {a}
								</li>
							))}
						</ul>
					</div>

					{/* status and type */}
					<div className="ml-4 sm:ml-12 md:ml-24 lg:32 space-y-3 mt-6">
						<div>
							<p className="text-sm bg-gray-200 w-fit px-2 rounded-lg dark:bg-inherit dark:border-2 border-[var(--highlight)]">
								{property.type.split("_").join(" ")}
							</p>
						</div>

						<div>
							<p
								className={`text-sm w-fit px-2 rounded-lg ${
									property.status === "AVAILABLE"
										? "text-green-500 border-1 border-green-600"
										: "text-red-400 border-1 border-red-400"
								}`}>
								{property.status.toLowerCase()}
							</p>
						</div>
					</div>

					{/* location and price */}
					<div className="mt-6">
						<p className="ml-4 sm:ml-12 md:ml-24 lg:32">
							<span className="text-sm text-[var(--text-muted)]">
								Location:
							</span>{" "}
							{property.location}
						</p>
						<p className="ml-4 sm:ml-12 md:ml-24 lg:32 ">
							<span className="text-sm text-[var(--text-muted)]">Price:</span>{" "}
							{property.price.toLocaleString("en-KE")}
							<span className="text-sm text-[var(--text-muted)]">/month</span>
						</p>
					</div>

					{/* metadata */}
					<div className="ml-4 sm:ml-12 md:ml-24 lg:32 space-y-2 mt-6 ">
						<div className="flex items-center gap-2 text-[var(--info)]">
							<Eye size={16} />
							<p className=" italic text-xs">
								{property.views > 0
									? `Viewed By ${property.views} people`
									: "You are the first one to view"}
							</p>
						</div>
						<div className="flex items-center gap-2 text-[var(--text-muted)] font-light">
							<Calendar size={16} />
							<p className=" italic text-xs">Posted on {formattedDate}</p>
						</div>
					</div>

					{/* owner */}
					<div className="ml-4 sm:ml-12 md:ml-24 lg:32 space-y-2 mt-8 cursor-pointer">
						<p className="text-[var(--info)] text-sm ">Owned by: </p>
						<div className="bg-[var(--bg-light)] p-4 flex items-center gap-5 rounded-lg border-1 border-[var(--highlight)]">
							<img
								src={property.owner.avatarUrl ?? AVATAR_PLACEHOLDER_SVG}
								alt={property.owner.username}
								className="object-cover w-12 h-12 rounded-full border-2 border-[var(--highlight)]"
							/>
							<h4
								onClick={() => navigate(`/property/${property?.ownerId}`)}
								className="flex items-center gap-1 text-lg flex-wrap underline">
								{property.owner.username}
								{property.owner.isVerified ? (
									<BadgeCheck size={18} color="white" fill="#0f74c5" />
								) : (
									<Badge size={18} color="#5c6670" />
								)}
							</h4>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default PropertyDetails;
