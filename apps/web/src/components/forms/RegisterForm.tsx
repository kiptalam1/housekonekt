const RegisterForm = () => {
	return (
		<form className="flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-[var(--bg-light)] p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg gap-6">
			{/* username */}
			<div className="">
				<label htmlFor="username" className="text-[var(--text-muted)]">
					Enter your username:
				</label>
				<input
					type="text"
					id="username"
					name="username"
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
						value="user"
						defaultChecked
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
						value="owner"
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
				className="bg-[var(--primary)] text-white p-2 rounded-lg font-semibold hover:bg-[var(--secondary)] transition-all duration-150 cursor-pointer">
				Sign Up
			</button>
		</form>
	);
};

export default RegisterForm;
