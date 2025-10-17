import { useState, type ChangeEvent, type FormEvent } from "react";
import { registerUser } from "../../utils/registerUser";
import { useNavigate } from "react-router-dom";
import { HouseWifi } from "lucide-react";
import { toast } from "sonner";

const RegisterForm = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "user",
	});

	const navigate = useNavigate();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// validate passwords before calling api;
		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setLoading(true);
		try {
			const success = await registerUser(formData);
			if (success) navigate("/auth/login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-[var(--bg-light)] p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg gap-6">
			{/* username */}
			<div className="">
				<label htmlFor="username" className="text-[var(--text-muted)]">
					Enter your username:
				</label>
				<input
					type="text"
					id="username"
					name="username"
					value={formData.username}
					onChange={handleChange}
					className="w-full border border-[var(--border-muted)] rounded-lg px-2 py-1 outline-none focus:ring-2 ring-[var(--primary)] hover:border-[var(--info)] text-lg bg-[var(--bg)] mt-2"
				/>
			</div>
			{/* email */}
			<div className="">
				<label htmlFor="email" className="text-[var(--text-muted)]">
					Enter your email:
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className="w-full border border-[var(--border-muted)] rounded-lg px-2 py-1 outline-none focus:ring-2 ring-[var(--primary)] hover:border-[var(--info)] text-lg bg-[var(--bg)] mt-2"
				/>
			</div>
			{/* passwords */}
			<div className="">
				<label htmlFor="password" className="text-[var(--text-muted)]">
					Enter your password:
				</label>
				<input
					type="password"
					id="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					className="w-full border border-[var(--border-muted)] rounded-lg px-2 py-1 outline-none focus:ring-2 ring-[var(--primary)] hover:border-[var(--info)] text-lg bg-[var(--bg)] mt-2"
				/>
			</div>
			{/* confirm password */}
			<div className="">
				<label htmlFor="confirmPassword" className="text-[var(--text-muted)]">
					Confirm your password:
				</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					value={formData.confirmPassword}
					onChange={handleChange}
					className="w-full border border-[var(--border-muted)] rounded-lg px-2 py-1 outline-none focus:ring-2 ring-[var(--primary)] hover:border-[var(--info)] text-lg bg-[var(--bg)] mt-2"
				/>
			</div>

			<div className="space-y-3">
				<p className="text-lg font-medium">
					Are you signing up as a property owner or a regular user?
				</p>
				<div className="flex gap-2 items-center">
					<input
						type="radio"
						name="role"
						id="user-role"
						value="USER"
						checked={formData.role === "USER"}
						onChange={handleChange}
						className="accent-[var(--primary)] w-5 h-5 cursor-pointer transition-all duration-150 hover:scale-110 focus:ring-2 focus:ring-[var(--info)]"
					/>
					<label
						htmlFor="user-role"
						className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--text)]">
						User
					</label>
				</div>

				<div className="flex gap-2 items-center">
					<input
						type="radio"
						name="role"
						id="owner-role"
						value="OWNER"
						checked={formData.role === "OWNER"}
						onChange={handleChange}
						className="accent-[var(--primary)] w-5 h-5 cursor-pointer transition-all duration-150 hover:scale-110 focus:ring-2 focus:ring-[var(--info)]"
					/>
					<label
						htmlFor="owner-role"
						className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--text)]">
						Owner
					</label>
				</div>
			</div>

			<button
				type="submit"
				disabled={loading}
				className={`flex items-center justify-center bg-[var(--primary)] text-white p-2 rounded-lg font-semibold transition-all duration-150 cursor-pointer ${
					loading
						? "opacity-50 cursor-not-allowed"
						: "hover:bg-[var(--secondary)]"
				}`}>
				{loading ? (
					<span className="animate-pulse">
						<HouseWifi size={18} />
					</span>
				) : (
					"Sign Up"
				)}
			</button>
		</form>
	);
};

export default RegisterForm;
