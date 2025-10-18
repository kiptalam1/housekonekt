import { useEffect, useState } from "react";
import api from "../api";
import PropertyCard from "./cards/PropertyCard";
import PropertyCardSkeleton from "./skeletons/PropertyCardSkeleton";

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
};

type PropertyResponse = {
	meta: {
		page: number;
		skip: number;
		limit: number;
		totalProperty: number;
		totalPages: number;
	};
	data: Property[];
};

const PropertyListings = () => {
	const [property, setProperty] = useState<PropertyResponse["data"]>([]);
	// const [meta, setMeta] = useState<PropertyResponse["meta"] | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProperty = async () => {
			try {
				setLoading(true);
				const result = await api.get("/properties");
				setProperty(result.data.data);
				// setMeta(result.data.meta);
			} catch (error) {
				console.error("Error fetching properties:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProperty();
	}, []);
	return (
		<section className="py-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-wrap gap-5 lg:gap-4 justify-center lg:justify-start">
					{loading
						? Array.from({ length: 6 }).map((_, i) => (
								<PropertyCardSkeleton key={i} />
						  ))
						: property.map((p) => (
								<PropertyCard
									key={p.id}
									id={p.id}
									title={p.title}
									amenities={p.amenities}
									images={p.images}
									location={p.location}
									price={p.price}
									status={p.status}
									type={p.type}
									createdAt={p.createdAt}
									deletedAt={p.deletedAt}
								/>
						  ))}
				</div>
			</div>
		</section>
	);
};

export default PropertyListings;
