import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { handleError } from "../../utils/common";
import api from "../../api";
import { Loader2 } from "lucide-react";
import type { User } from "../../pages/Admin";

export type UpdateUserModalTypes = {
	open: boolean;
	onClose: () => void;
	updateData?: {
		id: string;
		username: string;
		email: string;
		role: "ADMIN" | "OWNER" | "USER";
		// isVerified: boolean
		phone?: string;
		bio?: string;
		avatarUrl: string | null;
	};
	onUpdate: (user: User) => void;
};

const UpdateUserModal = ({
	open,
	onClose,
	updateData,
	onUpdate,
}: UpdateUserModalTypes) => {
	const [formData, setFormData] = useState(
		updateData || {
			username: "",
			email: "",
			role: "USER",
			phone: "",
			bio: "",
			avatarUrl: "",
		}
	);
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState("");
	const [isUpdatingUser, setIsUpdatingUser] = useState(false);
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "auto";
	}, [open]);

	useEffect(() => {
		if (updateData?.avatarUrl) {
			setPreview(updateData.avatarUrl);
		} else {
			setPreview("");
		}
	}, [updateData]);

	function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}

	function handleTextAreaChange(e: ChangeEvent<HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}

	function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}

	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		const selectedFile = e.target.files?.[0] ?? null;
		setFile(selectedFile);

		if (selectedFile) {
			const previewUrl = URL.createObjectURL(selectedFile);
			setPreview(previewUrl);
		} else {
			setPreview("");
		}
	}

	async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const data = new FormData();
		data.append("username", formData.username);
		data.append("email", formData.email);
		data.append("role", formData.role);
		if (formData.bio) data.append("bio", formData.bio);
		if (formData.phone) data.append("phone", formData.phone ?? "");

		if (file) {
			data.append("avatarUrl", file);
		}

		setIsUpdatingUser(true);

		try {
			const res = await api.patch(
				`/users/user/${updateData?.id}/update`,
				data,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			toast.success(res.data.message || "User updated successfully");
			onUpdate(res.data.data);
		} catch (error) {
			console.error("Error updating user", error);
			toast.error(handleError(error));
		} finally {
			setIsUpdatingUser(false);
		}
	}

	if (!open) return null;

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 bg-black/40 flex items-center justify-center">
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full md:max-w-xl lg:max-w-2xl rounded-lg bg-[var(--bg-light)] overflow-y-auto py-4 max-h-[85vh] overscroll-auto scrollbar-thin scrollbar-h-2 scrollbar-thumb-[var(--primary)] scrollbar-thumb-rounded-xl 
				scrollbar-track-gray-200">
				<h2 className="text-center text-2xl text-[var(--primary)] font-bold p-4">
					Update User Info
				</h2>
				<form
					onSubmit={handleFormSubmit}
					className="flex flex-col gap-2 p-4 py-6">
					<div className="flex flex-col gap-1">
						<label htmlFor="username">Username:</label>
						<input
							type="text"
							name="username"
							id="username"
							required
							value={formData.username}
							onChange={handleInputChange}
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)]"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="email">Email:</label>
						<input
							type="text"
							name="email"
							id="email"
							required
							value={formData.email}
							onChange={handleInputChange}
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)]"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="role">Role:</label>
						<select
							name="role"
							id="role"
							required
							value={formData.role}
							onChange={handleSelectChange}
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
							value={formData.phone}
							onChange={handleInputChange}
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)]"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="bio">Bio:</label>
						<textarea
							autoFocus
							name="bio"
							id="bio"
							value={formData.bio}
							onChange={handleTextAreaChange}
							className="border border-[var(--highlight)] outline-none rounded-xl p-2 w-full bg-[var(--bg)] min-h-10 max-h-[200px] overflow-y-auto hide-scrollbar"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="avatarUrl">Avatar:</label>
						<input
							type="file"
							name="avatarUrl"
							id="avatarUrl"
							accept="image/*"
							onChange={handleFileChange}
							className="border border-[var(--highlight)] outline-none rounded-xl w-full bg-[var(--bg)] file:px-4 file:py-2 file:rounded-xl file:bg-[var(--primary)] file:border-0 file:text-white file:cursor-pointer text-sm"
						/>
						{preview && (
							<img
								src={preview}
								alt="Preview"
								className="w-24 h-24 object-cover rounded-lg mt-2"
							/>
						)}
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
							className=" flex items-center justify-center px-2 py-1 bg-[var(--primary)] rounded-lg text-lg cursor-pointer font-semibold hover:opacity-70 transition-all duration-150">
							{isUpdatingUser ? (
								<Loader2 size={24} className="animate-spin" />
							) : (
								"Update"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdateUserModal;
