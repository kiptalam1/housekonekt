import { House, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLACEHOLDER_SVG } from "../../utils/common.ts";

export type Property = {
	id: string;
	title: string;
	price: number;
	location: string;
	amenities: string[];
	createdAt: string;
	images?: string[];
	status: "AVAILABLE" | "FULL";
	type: string;
	deletedAt: string | null;
};

const PropertyCard = (props: Property) => {
	const navigate = useNavigate();
	const formattedDate = new Date(
		props.createdAt.split("T")[0]
	).toLocaleDateString("en-US", {
		dateStyle: "medium",
	});

	return (
		<div
			onClick={() => navigate(`/properties/${props.id}`)}
			className="w-full max-w-[300px] h-[320px] rounded-xl shadow-md dark:border border-[var(--highlight)] hover:shadow-xl transition-all duration-150 cursor-pointer dark:hover:shadow-[0_0_10px_var(--highlight)]">
			<div className="w-full h-1/2">
				<img
					src={props.images?.length ? props.images[0] : PLACEHOLDER_SVG}
					alt={props.title}
					className="w-full h-full object-cover rounded-xl"
				/>
			</div>
			<div className="flex items-center justify-between px-3 py-2 mt-2">
				<h3 className="text-base font-semibold truncate">
					{props.title.trim().slice(0, 20)}
				</h3>
				<span
					className={`rounded-full px-1 py-0.5 text-xs w-[80px] text-center ${
						props.status === "AVAILABLE"
							? "bg-green-200 text-green-700"
							: "bg-red-200 text-red-700"
					}`}>
					{props.status.toLowerCase()}
				</span>
			</div>
			<div className="px-3 py-1">
				<p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
					<House size={12} />
					{props.type.split("_").join(" ")}
				</p>
				<p className="text-sm text-[var(--text-muted)] py-1 flex items-center gap-1 truncate">
					<MapPin size={12} />
					{props.location.trim().slice(0, 30)}
				</p>

				<p className="text-sm text-[var(--text-muted)] py-1 truncate">
					KSh {props.price.toLocaleString("en-KE").slice(0, 30)}
				</p>
				<p className="text-[var(--text-muted)] text-xs py-1">
					Posted on: {formattedDate}
				</p>
			</div>
		</div>
	);
};

export default PropertyCard;
