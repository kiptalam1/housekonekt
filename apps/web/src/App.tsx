import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyOwner from "./pages/PropertyOwner";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import Messaging from "./pages/Messaging";
import useSocketConnection from "./hooks/useSocketConnection";
function App() {
	useSocketConnection();
	return (
		<div className="min-h-screen w-full p-6 lg:px-10 bg-[var(--bg)] text-[var(--text)]">
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/home" element={<Home />} />

				<Route path="/properties/:id" element={<PropertyDetails />} />
				<Route path="/property/:id/owner" element={<PropertyOwner />} />
				<Route path="/auth/login" element={<LoginPage />} />
				<Route path="/auth/register" element={<RegisterPage />} />
				<Route path="/dashboard/:id" element={<Dashboard />} />
				<Route path="/user/me" element={<MyProfile />} />
				<Route path="/owner/messaging" element={<Messaging />} />
			</Routes>
			<Toaster richColors position="top-center" />
		</div>
	);
}

export default App;
