import { Edit, Loader2, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { AdminOutletContext } from "../../pages/Admin";
import { toast } from "sonner";
import api from "../../api";
import { useState } from "react";
import { handleError } from "../../utils/common";
import UpdatePropertyModal, {
	type PropertyAndFilesUpdateTypes,
} from "../modals/UpdatePropertyModal";

const AdminProperties = () => {
	const { loadingProperties, properties, setProperties } =
		useOutletContext<AdminOutletContext>();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	// const updatedProperty = properties?.filter((p) => p.id === updatingId)[0];

	async function handleDeleteProperty(id: string | null) {
		if (!id) return;
		try {
			setDeletingId(id);
			const { data } = await api.patch(`/properties/${id}/delete`);
			toast.success(data.message || "Property deleted successfully");
			setDeletedIds((prev) => new Set([...prev, id]));
			setProperties((prev) =>
				prev.map((p) =>
					p.id === id ? { ...p, deletedAt: new Date().toISOString() } : p
				)
			);
		} catch (error) {
			console.error("Error deleting property", error);
			toast.error(handleError(error));
		} finally {
			setDeletingId(null);
		}
	}

	const fetchAllProperties = async () => {
		try {
			const res = (await api.get("/properties")).data;
			if (!res) throw new Error(res.error || "Failed to load properties");
			setProperties(res.data);
		} catch (error) {
			console.error("Error refetching properties", error);
			toast.error(handleError(error));
		}
	};

	return (
		<section className="w-full overflow-x-auto">
			{loadingProperties && (
				<div className="flex justify-center text-[var(--primary)] animate-spin mt-5">
					<Loader2 size={20} />
				</div>
			)}
			<table className="rounded-lg overflow-x-auto">
				<thead className="bg-[var(--bg-light)] border-b border-[var(--primary)]">
					<tr>
						<th className="p-1 text-left font-bold">Name</th>
						<th className="p-1 text-left font-bold">Type</th>
						<th className="p-1 text-left font-bold">Location</th>
						<th className="p-1 text-left font-bold">Units</th>
						<th className="p-1 text-left font-bold">Status</th>
						<th className="p-1 text-left font-bold">Price</th>
						<th className="p-1 text-left font-bold">Amenities</th>
						<th className="p-1 text-left font-bold">Description</th>
						<th className="p-1 text-left font-bold">Views</th>
						<th className="p-1 text-left font-bold">Owner</th>
						<th className="p-1 text-left font-bold">Created</th>
						<th className="p-1 text-left font-bold">Actions</th>
					</tr>
				</thead>
				<tbody>
					{!loadingProperties && properties?.length === 0 && (
						<tr>
							<td
								colSpan={11}
								className="text-[var(--text-muted)] text-lg italic">
								No properties yet...
							</td>
						</tr>
					)}
					{!loadingProperties &&
						properties &&
						properties.length > 0 &&
						properties.map((p) => (
							<tr
								key={p.id}
								className={`border-b border-[var(--border-muted)] text-s ${
									p.deletedAt != null || deletedIds.has(p.id)
										? "line-through text-[var(--border)] text-sm"
										: ""
								}`}>
								<td className="p-1">{p.title}</td>
								<td className="p-1">{p.type.toLocaleLowerCase()}</td>
								<td className="p-1">{p.location}</td>
								<td className="p-1 text-center">{p.units}</td>
								<td
									className={`p-1 text-xs
                    ${
											p.status === "AVAILABLE" && p.deletedAt == null
												? "text-green-700"
												: p.status === "FULL" && p.deletedAt == null
												? "text-red-700"
												: "text-[var(--border)]"
										} `}>
									{p.status}
								</td>
								<td className="p-1">{p.price}</td>

								<td className="p-1 text-xs lg:text-sm">
									{p.amenities.join(", ")}
								</td>
								<td className="p-1 text-xs lg:text-sm">{p.description}</td>
								<td className="p-1 text-center">{p.views}</td>
								<td className="p-1">{p.owner?.username}</td>
								<td className="p-1  text-xs">{p.createdAt.split("T")[0]}</td>
								<td className="p-1 text-xs text-center gap-4 space-x-4">
									<button
										type="button"
										aria-label="update"
										disabled={updatingId === p.id}
										onClick={() => {
											setUpdatingId(p.id);
											setIsModalOpen(true);
										}}
										className="cursor-pointer text-blue-500 hover:text-blue-800 disabled:text-blue-950 disabled:cursor-not-allowed">
										{updatingId === p.id ? (
											<Loader2 size={24} className="animate-spin" />
										) : (
											<Edit size={24} />
										)}
									</button>

									<button
										type="button"
										aria-label="delete"
										disabled={
											p.deletedAt != null ||
											deletingId === p.id ||
											deletedIds.has(p.id)
										}
										onClick={() => handleDeleteProperty(p.id)}
										className="cursor-pointer text-red-500 hover:text-red-800 disabled:text-red-950 disabled:cursor-not-allowed">
										{deletingId === p.id ? (
											<Loader2 size={24} className="animate-spin" />
										) : (
											<Trash2 size={24} />
										)}
									</button>
								</td>
								<UpdatePropertyModal
									open={!!updatingId && isModalOpen}
									close={() => {
										setUpdatingId(null);
										setIsModalOpen(false);
									}}
									data={
										properties.find(
											(p) => p.id === updatingId
										) as PropertyAndFilesUpdateTypes
									}
									onUpdated={() => fetchAllProperties()}
								/>
							</tr>
						))}
				</tbody>
			</table>
		</section>
	);
};

export default AdminProperties;
