import { useEffect } from "react";

type UpdateUserModalTypes = {
	open: boolean;
	onClose: () => void;
	updateData?: {
		username: string;
		email: string;
		role: "ADMIN" | "OWNER" | "USER";
		isVerified: boolean;
		phone: string;
		bio: string;
	};
};

const UpdateUserModal = ({
	open,
	onClose,
	updateData,
}: UpdateUserModalTypes) => {
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "auto";
	}, [open]);
	if (!open) return null;
	return (
		<div
			onClick={onClose}
			className="fixed inset-0 bg-black/40 flex items-center justify-center">
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full md:max-w-xl lg:max-w-2xl rounded-lg bg-[var(--bg-light)] overflow-y-auto py-4">
				<h2 className="text-center text-2xl text-[var(--primary)] font-bold p-4">
					Update User Info
				</h2>
				<form className="flex flex-col gap-2 p-4 py-6">
					<div className="flex flex-col gap-1">
						<label htmlFor="username">Username:</label>
						<input
							type="text"
							name="username"
							id="username"
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)]"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="email">Email:</label>
						<input
							type="text"
							name="email"
							id="email"
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)]"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="role">Role:</label>
						<select
							name="role"
							id="role"
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)]">
							<option value="">Select Role</option>
							<option value="ADMIN">ADMIN</option>
							<option value="OWNER">OWNER</option>
							<option value="USER">USER</option>
						</select>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="phone">Phone:</label>
						<input
							type="text"
							name="phone"
							id="phone"
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)]"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="bio">Bio:</label>
						<textarea
							autoFocus
							name="bio"
							id="bio"
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)] min-h-10 max-h-[200px] overflow-y-auto hide-scrollbar"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="avatarUrl">Avatar:</label>
						<input
							type="file"
							name="avatarUrl"
							id="avatarUrl"
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)]"
						/>
					</div>

					{/* buttons */}
					<div className="flex items-center justify-between gap-2 text-white mt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex items-center justify-center px-2 py-1 bg-[var(--danger)] rounded-lg text-lg cursor-pointer font-semibold hover:opacity-70 transition-all duration-150">
							Cancel
						</button>
						<button
							type="submit"
							className="flex items-center justify-center px-2 py-1 bg-[var(--primary)] rounded-lg text-lg cursor-pointer font-semibold hover:opacity-70 transition-all duration-150">
							Update
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdateUserModal;
