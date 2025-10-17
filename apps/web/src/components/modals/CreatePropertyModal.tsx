import { Plus } from "lucide-react";

const CreatePropertyModal = ({
	open,
	close,
}: {
	open: boolean;
	close: () => void;
}) => {
	return (
		<dialog
			open={open}
			className="mx-auto bg-[var(--bg-light)] text-[var(--text)] rounded-lg p-4 sm:p-6 w-full sm:max-w-md md:max-w-lg">
			<form method="dialog" className="flex flex-col gap-5 justify-center py-4">
				<div className="">
					<label htmlFor="" className="text-[var(--text-muted)] font-semibold">
						Property name:
					</label>
					<input
						type="text"
						required
						className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
					/>
				</div>

				<div className="">
					<label htmlFor="" className="text-[var(--text-muted)] font-semibold">
						Located in:
					</label>
					<input
						type="text"
						required
						className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
					/>
				</div>

				<div className="">
					<label htmlFor="" className="text-[var(--text-muted)] font-semibold">
						Rent Amount{" "}
						<span className="text-sm italic">(In Kenyan Shillings):</span>
					</label>
					<input
						type="number"
						required
						min={1}
						className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1"
					/>
				</div>
				<div className="">
					<label htmlFor="" className="text-[var(--text-muted)] font-semibold">
						Units{" "}
						<span className="text-sm italic">
							(How may rooms are available for renting?):
						</span>
					</label>
					<input
						type="number"
						min={1}
						required
						className="px-2 py-1 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1 placeholder:text-sm placeholder:italic"
					/>
				</div>

				<div className="">
					<label htmlFor="" className="text-[var(--text-muted)] font-semibold">
						Property Description:
					</label>
					<textarea
						autoCapitalize="sentences"
						required
						maxLength={2000}
						rows={4}
						placeholder="Briefly describe your property in a few words..."
						className="px-2 py-1 max-h-100 rounded-lg w-full border border-[var(--border)] outline-none focus:ring ring-[var(--primary)] text-lg mt-1 placeholder:text-sm placeholder:italic"
					/>
				</div>

				<div className="">
					<label htmlFor="" className="text-[var(--text-muted)] font-semibold">
						Property Type:
					</label>
					<select
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
							className="accent-[var(--primary)] w-5 h-5 hover:scale-110 focus:ring-2 focus:ring-[var(--info)] cursor-pointer transition-all duration-150 rounded-full"
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
							className="accent-[var(--primary)] w-5 h-5 hover:scale-110 focus:ring-2 focus:ring-[var(--info)] cursor-pointer transition-all duration-150 rounded-full"
						/>
						<label
							htmlFor="status-full"
							className="cursor-pointer hover:text-[var(--text-muted)]">
							Full
						</label>
					</div>
				</div>

				<div className="">
					<label htmlFor="" className="text-[var(--text-muted)] font-semibold">
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
						className="border border-[var(--danger)] px-2 py-1 rounded-lg cursor-pointer text-[var(--danger)] font-semibold">
						Close
					</button>

					<button
						type="button"
						className="border border-[var(--info)] px-6 py-1 rounded-lg cursor-pointer text-[var(--primary)] font-semibold flex items-center gap-2 justify-center">
						<Plus size={20} />
						Create
					</button>
				</div>
			</form>
		</dialog>
	);
};

export default CreatePropertyModal;
