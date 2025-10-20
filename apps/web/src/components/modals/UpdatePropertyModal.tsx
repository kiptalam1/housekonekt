import { HouseWifi, Plus } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import api from "../../api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { Property } from "../../utils/common";

type UpdatePropertyModalProps = {
	open: boolean;
	close: () => void;
	data: Property;
};

type FormState = Partial<Omit<Property, "images">> & {
	images?: (string | File)[];
};

const UpdatePropertyModal = ({
	open,
	close,
	data,
}: UpdatePropertyModalProps) => {
	// <-- IMPORTANT: Partial<Property> | null so we can progressively fill fields
	const [formData, setFormData] = useState<FormState | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "auto";
	}, [open]);

	// Autofill — amenities is string[] in DB, so use it directly
	useEffect(() => {
		if (open && data) {
			setFormData({
				...data,
				amenities: Array.isArray(data.amenities) ? data.amenities : [],
				// images in DB are string[] (URLs). Local UI may also push File objects.
				images: data.images ?? [],
			});
		}
	}, [open, data]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) =>
			prev
				? { ...prev, [name]: value }
				: ({ [name]: value } as Partial<Property>)
		);
	};

	// Amenities textarea -> string[] conversion (textarea must be string)
	const handleAmenitiesTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const arr = e.target.value
			.split(",")
			.map((a) => a.trim())
			.filter(Boolean);
		setFormData((prev) =>
			prev ? { ...prev, amenities: arr } : { amenities: arr }
		);
	};

	const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? Array.from(e.target.files) : [];
		setFormData((prev) => ({
			...(prev ?? {}),
			images: [...(prev?.images ?? []), ...files],
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formData) return;

		try {
			setIsUpdating(true);

			const fd = new FormData();

			if (formData.title != null) fd.append("title", String(formData.title));
			if (formData.price != null) fd.append("price", String(formData.price));
			if (formData.location != null)
				fd.append("location", String(formData.location));
			if (formData.units != null) fd.append("units", String(formData.units));
			if (formData.description != null)
				fd.append("description", String(formData.description));
			if (formData.type != null) fd.append("type", String(formData.type));
			if (formData.status != null) fd.append("status", String(formData.status));
			if (formData.amenities && Array.isArray(formData.amenities)) {
				fd.append("amenities", (formData.amenities as string[]).join(","));
			}

			const imgs = formData.images ?? [];
			for (const item of imgs) {
				if (item instanceof File) {
					fd.append("images", item); // multer will expose in req.files
				}
			}
			const res = await api.patch(`/properties/${data.id}/update`, fd, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			toast.success(res.data?.message || "Property updated successfully");
			close();
		} catch (err) {
			console.error("Error updating property", err);
			toast.error(
				err instanceof AxiosError
					? err.response?.data?.error
					: "Failed to update property"
			);
		} finally {
			setIsUpdating(false);
		}
	};

	if (!open) return null;

	return (
		<div
			onClick={(e) => e.target === e.currentTarget && close()}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-0">
			<div className="bg-[var(--bg-light)] text-[var(--text)] rounded-lg p-4 sm:p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-lg hide-scrollbar">
				<h1 className="text-center text-xl sm:text-2xl font-bold text-[var(--primary)] mb-5">
					Update Property
				</h1>

				<form
					onSubmit={handleSubmit}
					method="dialog"
					className="flex flex-col gap-5 justify-center py-4">
					{/* title */}
					<div>
						<label
							htmlFor="title"
							className="text-[var(--text-muted)] font-semibold">
							Property name:
						</label>
						<input
							id="title"
							name="title"
							value={formData?.title ?? ""}
							onChange={handleChange}
							required
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
						/>
					</div>

					{/* location */}
					<div>
						<label
							htmlFor="location"
							className="text-[var(--text-muted)] font-semibold">
							Located in:
						</label>
						<input
							id="location"
							name="location"
							value={formData?.location ?? ""}
							onChange={handleChange}
							required
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
						/>
					</div>

					{/* price */}
					<div>
						<label
							htmlFor="price"
							className="text-[var(--text-muted)] font-semibold">
							Rent Amount{" "}
							<span className="text-sm italic">(In Kenyan Shillings):</span>
						</label>
						<input
							id="price"
							name="price"
							type="number"
							value={formData?.price ?? ""}
							onChange={handleChange}
							min={1}
							step="0.01"
							required
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
						/>
					</div>

					{/* units */}
					<div>
						<label
							htmlFor="units"
							className="text-[var(--text-muted)] font-semibold">
							Units{" "}
							<span className="text-sm italic">
								(How many rooms are available?)
							</span>
						</label>
						<input
							id="units"
							name="units"
							type="number"
							value={formData?.units ?? ""}
							onChange={handleChange}
							min={1}
							required
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
						/>
					</div>

					{/* description */}
					<div>
						<label
							htmlFor="description"
							className="text-[var(--text-muted)] font-semibold">
							Property Description:
						</label>
						<textarea
							id="description"
							name="description"
							value={formData?.description ?? ""}
							onChange={handleChange}
							autoCapitalize="sentences"
							required
							maxLength={2000}
							rows={4}
							placeholder="Briefly describe your property in a few words..."
							className="px-2 py-1 max-h-100 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1 placeholder:text-sm placeholder:italic"
						/>
					</div>

					{/* type */}
					<div>
						<label
							htmlFor="type"
							className="text-[var(--text-muted)] font-semibold">
							Property Type:
						</label>
						<select
							id="type"
							name="type"
							value={formData?.type ?? ""}
							onChange={handleChange}
							required
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1 placeholder:text-sm placeholder:italic">
							<option value="">Select type</option>
							<option value={"BEDSITTER"}>BEDSITTER</option>
							<option value={"STUDIO"}>STUDIO</option>
							<option value={"ONE_BEDROOM"}>ONE BEDROOM</option>
							<option value={"TWO_BEDROOM"}>TWO BEDROOM</option>
							<option value={"THREE_BEDROOM"}>THREE BEDROOM</option>
							<option value={"MAISONETTE"}>MAISONETTE</option>
							<option value={"TOWN_HOUSE"}>TOWN HOUSE</option>
							<option value={"BUNGALOW"}>BUNGALOW</option>
							<option value={"SERVICED_APARTMENT"}>SERVICED APARTMENT</option>
							<option value={"VILLA"}>VILLA</option>
						</select>
					</div>

					{/* status */}
					<div className="space-y-2">
						<p className="text-[var(--text-muted)] font-semibold">
							Property Status:
						</p>
						<div className="flex items-center gap-3 p-1">
							<input
								id="status-available"
								required
								type="radio"
								name="status"
								value="AVAILABLE"
								checked={formData?.status === "AVAILABLE"}
								onChange={handleChange}
								className="accent-[var(--primary)] w-5 h-5 hover:scale-110 focus:ring-1 focus:ring-[var(--info)] cursor-pointer transition-all duration-150 rounded-full"
							/>
							<label
								htmlFor="status-available"
								className="cursor-pointer hover:text-[var(--text-muted)]">
								Available
							</label>
						</div>

						<div className="flex items-center gap-3 p-1">
							<input
								id="status-full"
								required
								type="radio"
								name="status"
								value="FULL"
								checked={formData?.status === "FULL"}
								onChange={handleChange}
								className="accent-[var(--primary)] w-5 h-5 hover:scale-110 focus:ring-1 focus:ring-[var(--info)] cursor-pointer transition-all duration-150 rounded-full"
							/>
							<label
								htmlFor="status-full"
								className="cursor-pointer hover:text-[var(--text-muted)]">
								Full
							</label>
						</div>
					</div>

					{/* amenities as textarea (string[] <-> comma string) */}
					<div>
						<label
							htmlFor="amenities"
							className="text-[var(--text-muted)] font-semibold">
							Amenities Provided:
						</label>
						<textarea
							id="amenities"
							name="amenities"
							value={(formData?.amenities ?? []).join(", ")}
							onChange={handleAmenitiesTextChange}
							autoCapitalize="sentences"
							required
							maxLength={2000}
							rows={4}
							placeholder="Separate using commas. e.g., wifi, parking, swimming pool..."
							className="px-2 py-1 max-h-100 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1 placeholder:text-sm placeholder:italic"
						/>
					</div>

					{/* images */}
					<div>
						<label
							htmlFor="images"
							className="text-[var(--text-muted)] font-semibold">
							Property Images:
						</label>
						<input
							id="images"
							name="images"
							type="file"
							multiple
							accept="image/*"
							onChange={handleFiles}
							className="block w-full text-sm text-[var(--text)] mt-1 cursor-pointer border border-[var(--border)] rounded-lg p-2"
						/>
					</div>

					{/* previews */}
					{formData?.images &&
						(formData.images as (string | File)[]).length > 0 && (
							<div className="flex flex-wrap gap-3 mt-2">
								{(formData.images as (string | File)[]).map((img, idx) => (
									<img
										key={idx}
										src={
											typeof img === "string" ? img : URL.createObjectURL(img)
										}
										alt={`Property ${idx + 1}`}
										className="w-20 h-20 object-cover rounded-lg border border-[var(--border)]"
									/>
								))}
							</div>
						)}

					{/* buttons */}
					<div className="flex items-center justify-between gap-5">
						<button
							type="button"
							disabled={isUpdating}
							onClick={close}
							className="border border-[var(--danger)] px-2 py-1 rounded-lg cursor-pointer text-[var(--danger)] font-semibold hover:scale-95 transition-all duration-150">
							Close
						</button>

						<button
							type="submit"
							disabled={isUpdating}
							className="border border-[var(--info)] px-6 py-1 rounded-lg cursor-pointer text-[var(--primary)] font-bold flex items-center gap-2 justify-center hover:scale-105 transition-all duration-150">
							{isUpdating ? (
								<span className="flex items-center justify-center animate-pulse">
									<HouseWifi size={20} />
								</span>
							) : (
								<span className="flex items-center justify-center gap-2">
									<Plus size={20} />
									Update
								</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdatePropertyModal;
