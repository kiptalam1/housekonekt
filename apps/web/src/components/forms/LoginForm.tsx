import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { HouseWifi } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type FormTypes = {
	email: string;
	password: string;
};

const LoginForm = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";
	const [formData, setFormData] = useState<FormTypes>({
		email: "",
		password: "",
	});
	const { loading, loginUser } = useAuth();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const success = await loginUser(formData);
		if (success) navigate(from, { replace: true });
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-[var(--bg-light)] px-4 sm:px-6 md:px-8 lg:p-10 py-10 rounded-lg shadow-lg gap-6">
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
					required
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
					required
					className="w-full border border-[var(--border-muted)] rounded-lg px-2 py-1 outline-none focus:ring-2 ring-[var(--primary)] hover:border-[var(--info)] text-lg bg-[var(--bg)] mt-2"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="flex items-center justify-center bg-[var(--primary)] text-white p-2 rounded-lg font-semibold hover:bg-[var(--secondary)] transition-all duration-150 cursor-pointer">
				{loading ? (
					<span className="flex items-center justify-center animate-pulse">
						<HouseWifi size={18} />
					</span>
				) : (
					"Log In"
				)}
			</button>
		</form>
	);
};

export default LoginForm;
