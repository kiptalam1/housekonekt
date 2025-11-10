import { useEffect, useState } from "react";
import api from "../../api";
import { Loader2 } from "lucide-react";
import type { Property } from "../../utils/common";
import { toast } from "sonner";
import { AxiosError } from "axios";

const AdminProperties = () => {
	const [properties, setProperties] = useState<Property[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchAllProperties = async () => {
			setIsLoading(true);
			try {
				const res = (await api.get("/properties")).data;
				if (!res) throw new Error(res.error || "Failed to load properties");

				setProperties(res.data);
			} catch (error) {
				console.error("Error fetching properties", error);
				toast.error(
					error instanceof AxiosError
						? error.response?.data.error
						: error instanceof Error
						? error.message
						: "Something went wrong."
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllProperties();
	}, []);

	return (
		<section className="w-full overflow-x-auto">
			{isLoading && (
				<div className="flex justify-center text-[var(--primary)] animate-spin mt-5">
					<Loader2 size={20} />
				</div>
			)}
			<table className="rounded-lg overflow-x-auto">
				<thead className="bg-[var(--bg-light)] border-b border-[var(--primary)]">
					<tr>
						<th className="p-1 text-left font-semibold">Title</th>
						<th className="p-1 text-left font-semibold">Location</th>
						<th className="p-1 text-left font-semibold">Price</th>
						<th className="p-1 text-left font-semibold">Units</th>
						<th className="p-1 text-left font-semibold">Status</th>
						<th className="p-1 text-left font-semibold">Type</th>
						<th className="p-1 text-left font-semibold">Amenities</th>
						<th className="p-1 text-left font-semibold">Description</th>
						<th className="p-1 text-left font-semibold">Views</th>
						<th className="p-1 text-left font-semibold">Owner</th>
						<th className="p-1 text-left font-semibold">CreatedAt</th>
					</tr>
				</thead>
				<tbody>
					{!isLoading && properties?.length === 0 && (
						<tr>
							<td
								colSpan={11}
								className="text-[var(--text-muted)] text-lg italic">
								No properties yet...
							</td>
						</tr>
					)}
					{!isLoading &&
						properties &&
						properties.length > 0 &&
						properties.map((p) => (
							<tr
								key={p.id}
								className={`border-b border-[var(--border-muted)] text-s ${
									p.deletedAt != null
										? "line-through text-[var(--border)] text-sm"
										: ""
								}`}>
								<td className="p-1">{p.title}</td>
								<td className="p-1">{p.location}</td>
								<td className="p-1">{p.price}</td>
								<td className="p-1">{p.units}</td>
								<td
									className={`p-1
                    ${
											p.status === "AVAILABLE" && p.deletedAt == null
												? "text-green-700"
												: p.status === "FULL" && p.deletedAt == null
												? "text-red-700"
												: "text-[var(--border)]"
										} `}>
									{p.status}
								</td>
								<td className="p-1">{p.type.toLocaleLowerCase()}</td>
								<td className="p-1">{p.amenities}</td>
								<td className="p-1">{p.description}</td>
								<td className="p-1">{p.views}</td>
								<td className="p-1">{p.owner?.username}</td>
								<td className="p-1  text-xs">{p.createdAt.split("T")[0]}</td>
							</tr>
						))}
				</tbody>
			</table>
		</section>
	);
};

export default AdminProperties;
