import { Plus } from "lucide-react";
import { useEffect } from "react";

const CreatePropertyModal = ({
	open,
	close,
}: {
	open: boolean;
	close: () => void;
}) => {
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "auto";
	}, [open]);

	if (!open) return null;
	return (
		<div
			onClick={(e) => e.target === e.currentTarget && close()}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-0">
			<div className="bg-[var(--bg-light)] text-[var(--text)] rounded-lg p-4 sm:p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-lg hide-scrollbar">
				<h1 className="text-center text-xl sm:text-2xl font-bold text-[var(--primary)] mb-5">
					Add new Property
				</h1>

				<form
					method="dialog"
					className="flex flex-col gap-5 justify-center py-4">
					<div className="">
						<label
							htmlFor="title"
							className="text-[var(--text-muted)] font-semibold">
							Property name:
						</label>
						<input
							id="title"
							type="text"
							required
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
						/>
					</div>

					<div className="">
						<label
							htmlFor="location"
							className="text-[var(--text-muted)] font-semibold">
							Located in:
						</label>
						<input
							id="location"
							type="text"
							required
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
						/>
					</div>

					<div className="">
						<label
							htmlFor="price"
							className="text-[var(--text-muted)] font-semibold">
							Rent Amount{" "}
							<span className="text-sm italic">(In Kenyan Shillings):</span>
						</label>
						<input
							id="price"
							type="number"
							required
							min={1}
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
						/>
					</div>
					<div className="">
						<label
							htmlFor="units"
							className="text-[var(--text-muted)] font-semibold">
							Units{" "}
							<span className="text-sm italic">
								(How may rooms are available for renting?):
							</span>
						</label>
						<input
							id="units"
							type="number"
							min={1}
							required
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1 placeholder:text-sm placeholder:italic"
						/>
					</div>

					<div className="">
						<label
							htmlFor="description"
							className="text-[var(--text-muted)] font-semibold">
							Property Description:
						</label>
						<textarea
							id="description"
							autoCapitalize="sentences"
							required
							maxLength={2000}
							rows={4}
							placeholder="Briefly describe your property in a few words..."
							className="px-2 py-1 max-h-100 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1 placeholder:text-sm placeholder:italic"
						/>
					</div>

					<div className="">
						<label
							htmlFor="type"
							className="text-[var(--text-muted)] font-semibold">
							Property Type:
						</label>
						<select
							id="type"
							required
							className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1 placeholder:text-sm placeholder:italic">
							<option value={""}>Select type</option>
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
								className="accent-[var(--primary)] w-5 h-5 hover:scale-110 focus:ring-1 focus:ring-[var(--info)] cursor-pointer transition-all duration-150 rounded-full"
							/>
							<label
								htmlFor="status-full"
								className="cursor-pointer hover:text-[var(--text-muted)]">
								Full
							</label>
						</div>
					</div>

					<div className="">
						<label
							htmlFor=""
							className="text-[var(--text-muted)] font-semibold">
							Amenities Provided:
						</label>
						<textarea
							autoCapitalize="sentences"
							required
							maxLength={2000}
							rows={4}
							placeholder="Separate using comas. e.g., wifi, parking, swimming pool..."
							className="px-2 py-1 max-h-100 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1 placeholder:text-sm placeholder:italic"
						/>
					</div>

					{/* buttons */}
					<div className="flex items-center justify-between gap-5">
						<button
							type="button"
							onClick={close}
							className="border border-[var(--danger)] px-2 py-1 rounded-lg cursor-pointer text-[var(--danger)] font-semibold hover:scale-95 transition-all duration-150">
							Close
						</button>

						<button
							type="button"
							className="border border-[var(--info)] px-6 py-1 rounded-lg cursor-pointer text-[var(--primary)] font-bold flex items-center gap-2 justify-center hover:scale-105 transition-all duration-150">
							<Plus size={20} />
							Create
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreatePropertyModal;
