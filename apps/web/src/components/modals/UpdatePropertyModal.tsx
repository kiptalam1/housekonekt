import { HouseWifi, Plus, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import api from "../../api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export type PropertyAndFilesUpdateTypes = {
	id: string;
	title: string;
	price: number;
	location: string;
	units: number;
	description: string;
	amenities: string[];
	images?: (string | File)[];
	status: string;
	type: string;
};

type UpdatePropertyModalProps = {
	open: boolean;
	close: () => void;
	data: PropertyAndFilesUpdateTypes;
	onUpdated?: () => void;
};

const UpdatePropertyModal = ({
	open,
	close,
	data,
	onUpdated,
}: UpdatePropertyModalProps) => {
	const [formData, setFormData] = useState<PropertyAndFilesUpdateTypes>(data);
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "auto";
	}, [open]);

	useEffect(() => {
		if (open && data) {
			setFormData(data);
		}
	}, [open, data]);

	function handleChange(
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}

	function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		const files = Array.from(e.target.files);
		setFormData((prev) => ({
			...prev,
			images: [...(prev.images || []), ...files], // Keep old + new images;
		}));
	}

	function handleRemoveImage(index: number) {
		setFormData((prev) => ({
			...prev,
			images: prev.images?.filter((_, i) => i !== index),
		}));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData();

		(Object.keys(formData) as (keyof PropertyAndFilesUpdateTypes)[]).forEach(
			(key) => {
				if (key === "images") return;
				let value = formData[key];
				if (key === "amenities") {
					if (Array.isArray(value)) value = (value as string[]).join(", ");
					value = String(value ?? "");
					fd.append(String(key), value);
					return;
				}
				if (Array.isArray(value)) {
					value = JSON.stringify(value);
				} else {
					value = String(value ?? "");
				}
				fd.append(key, value);
			}
		);

		// loop through images and append each to formData;
		if (formData.images && formData.images.length > 0) {
			formData.images.forEach((file) => {
				if (typeof file === "string") {
					fd.append("existingImages", file);
				} else {
					fd.append("images", file);
				}
			});
		}

		try {
			setIsUpdating(true);
			const res = await (
				await api.patch(`/properties/${data.id}/update`, fd, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
			).data;
			if (!res) {
				throw new Error("Something went wrong");
			}

			toast.success(res.message || "Property updated successfully");
			onUpdated?.();
			close();
		} catch (error) {
			console.error("Error in UpdatePropertyModal", error);
			toast.error(
				error instanceof AxiosError
					? error.response?.data.error
					: error instanceof Error
					? error.message
					: "Update failed"
			);
		} finally {
			setIsUpdating(false);
		}
	}

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
							<option value={"TOWNHOUSE"}>TOWN HOUSE</option>
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
							value={
								Array.isArray(formData?.amenities)
									? formData?.amenities.join(", ")
									: formData?.amenities || ""
							}
							onChange={handleChange}
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
							onChange={handleImageChange}
							className="block w-full text-sm text-[var(--text)] mt-1 cursor-pointer border border-[var(--border)] rounded-lg p-2"
						/>
					</div>

					{/* previews */}
					{formData?.images &&
						(formData.images as (string | File)[]).length > 0 && (
							<div className="flex flex-wrap gap-3 mt-2">
								{(formData.images as (string | File)[]).map((img, idx) => (
									<div key={idx} className="relative">
										<img
											key={idx}
											src={
												typeof img === "string" ? img : URL.createObjectURL(img)
											}
											alt={`Property ${idx + 1}`}
											className="w-20 h-20 object-cover rounded-lg border border-[var(--border)]"
										/>
										<button
											type="button"
											onClick={() => handleRemoveImage(idx)}
											className="absolute -top-2 -right-2 rounded-full"
											aria-label="remove image">
											<X size={24} color="red" />
										</button>
									</div>
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
							className="border border-[var(--info)] px-6 py-1 rounded-lg cursor-pointer text-[var(--primary)] font-bold flex items-center gap-2 justify-center hover:scale-105 transition-all duration-150 disabled:grayscale">
							{isUpdating ? (
								<span className="flex items-center justify-center animate-spin">
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
