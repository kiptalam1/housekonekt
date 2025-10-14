import { House, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

	const PLACEHOLDER_SVG =
		"data:image/svg+xml;utf8," +
		encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <rect x="48" y="48" width="704" height="400" rx="10" fill="#e5e7eb"/>
    <g fill="#d1d5db" opacity="0.9">
      <rect x="64" y="480" width="160" height="18" rx="4"/>
      <rect x="240" y="480" width="160" height="18" rx="4"/>
      <rect x="416" y="480" width="160" height="18" rx="4"/>
    </g>
    <text x="50%" y="310" font-family="Inter,Arial" font-size="28" font-weight="700" fill="#6b7280" text-anchor="middle">
      Image Coming Soon
    </text>
  </svg>`);

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
				<h3 className="text-base font-semibold truncate">{props.title}</h3>
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
				<p className="text-sm text-[var(--text-muted)] py-1 flex items-center gap-1">
					<MapPin size={12} />
					{props.location}
				</p>

				<p className="text-sm text-[var(--text-muted)] py-1">
					KSh {props.price.toLocaleString("en-KE")}
				</p>
				<p className="text-[var(--text-muted)] text-xs py-1">
					Posted on: {formattedDate}
				</p>
			</div>
		</div>
	);
};

export default PropertyCard;
