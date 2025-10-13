import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";

function App() {
	return (
		<div className="min-h-screen w-full p-6 lg:px-10 bg-[var(--bg)] text-[var(--text)]">
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/properties/:id" element={<PropertyDetails />} />
			</Routes>
			<Toaster richColors position="top-center" />
		</div>
	);
}

export default App;
