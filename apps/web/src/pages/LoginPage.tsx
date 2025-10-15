import LoginForm from "../components/forms/LoginForm";

const LoginPage = () => {
	return (
		<div className="min-h-screen flex flex-col gap-6 items-center sm:p-6 md:p-8 lg:p-10">
			<h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary)]">
				Log in to your account
			</h2>
			<LoginForm />
		</div>
	);
};

export default LoginPage;
