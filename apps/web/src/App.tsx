import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";

function App() {
	return (
		<div className="min-h-screen w-full p-6 lg:px-10 bg-[var(--bg)] text-[var(--text)]">
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</div>
	);
}

export default App;
