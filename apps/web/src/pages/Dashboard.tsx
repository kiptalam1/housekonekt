import { useEffect, useState } from "react";
import CreatePropertyModal from "../components/modals/CreatePropertyModal";
import api from "../api";
import { type Property, formatIsoDate } from "../utils/common.ts";
import { useNavigate, useParams } from "react-router-dom";
import {
	Edit,
	House,
	Loader,
	Loader2,
	MapPin,
	Plus,
	Trash2,
} from "lucide-react";
import { PLACEHOLDER_SVG } from "../utils/common.ts";
import { toast } from "sonner";
import { AxiosError } from "axios";

const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const { id: ownerId } = useParams();
	const [property, setProperty] = useState<Property[] | null>(null);
	const [fetchingProperty, setFetchingProperty] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const navigate = useNavigate();

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

	const handleDelete = async (id: string) => {
		try {
			setDeletingId(id);
			const res = (await api.patch(`/properties/${id}/delete`)).data;
			if (!res) throw new Error("Something went wrong");
			setProperty((prev) => prev && prev?.filter((p) => p.id !== id));
			toast.success(res.message || "Property deleted successfully");
		} catch (error) {
			console.error("Error deleting property", error);
			toast.error(
				error instanceof AxiosError
					? error.response?.data.error
					: error instanceof Error
					? error.message
					: "Failed to delete property"
			);
		} finally {
			setDeletingId(null);
		}
	};

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
				{property &&
					property.length > 0 &&
					property.map((p) => (
						<div
							key={p.id}
							className="w-full max-w-[300px] h-[400px] rounded-xl shadow-md dark:border border-[var(--highlight)] hover:shadow-xl transition-all duration-150  dark:hover:shadow-[0_0_10px_var(--highlight)]">
							<div
								onClick={() => navigate(`/properties/${p.id}`)}
								className="cursor-pointer">
								<div className="w-full h-[200px]">
									<img
										src={p.images?.length ? p.images[0] : PLACEHOLDER_SVG}
										alt={p.title}
										className="w-full h-full object-cover rounded-xl"
									/>
								</div>
								<div className="flex items-center justify-between px-3 py-2 mt-2">
									<h3 className="text-base font-semibold truncate">
										{p.title.trim().slice(0, 20)}
									</h3>
									<span
										className={`rounded-full px-1 py-0.5 text-xs w-[80px] text-center ${
											p.status === "AVAILABLE"
												? "bg-green-200 text-green-700"
												: "bg-red-200 text-red-700"
										}`}>
										{p.status.toLowerCase()}
									</span>
								</div>
								<div className="px-3 py-1">
									<p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
										<House size={12} />
										{p.type.split("_").join(" ")}
									</p>
									<p className="text-sm text-[var(--text-muted)] py-1 flex items-center gap-1 truncate">
										<MapPin size={12} />
										{p.location.trim().slice(0, 30)}
									</p>

									<p className="text-sm text-[var(--text-muted)] py-1 truncate">
										KSh {p.price.toLocaleString("en-KE").slice(0, 30)}
									</p>
									<p className="text-[var(--text-muted)] text-xs py-1">
										Posted on: {formatIsoDate(p.createdAt)}
									</p>
								</div>
							</div>
							{/* actions */}
							<div className="flex items-center justify-between gap-5 px-3 py-2">
								<button
									type="button"
									aria-label="edit property"
									className="cursor-pointer">
									<Edit
										size={24}
										className="text-blue-500 hover:text-blue-300 duration-150"
									/>
								</button>
								<button
									type="button"
									aria-label="delete property"
									disabled={deletingId === p.id}
									onClick={() => handleDelete(p.id)}
									className="cursor-pointer">
									{deletingId === p.id ? (
										<Loader2 size={20} className="text-red-400 animate-spin" />
									) : (
										<Trash2
											size={24}
											className="text-red-500 hover:text-red-300 duration-150"
										/>
									)}
								</button>
							</div>
						</div>
					))}
			</section>

			<CreatePropertyModal open={open} close={() => setOpen(false)} />
		</div>
	);
};

export default Dashboard;
