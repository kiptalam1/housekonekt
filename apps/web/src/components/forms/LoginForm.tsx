const LoginForm = () => {
	return (
		<form className="flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-[var(--bg-light)] p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg gap-6">
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

			<button
				type="submit"
				className="bg-[var(--primary)] text-white p-2 rounded-lg font-semibold hover:bg-[var(--secondary)] transition-all duration-150 cursor-pointer">
				Log In
			</button>
		</form>
	);
};

export default LoginForm;
