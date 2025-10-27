import { useState } from "react";

function Sidebar() {
	const [selected, setSelected] = useState<number | null>(null);

	// const handleSelected = (index: number) => {
	// 	setSelected(index);
	// };
	return (
		<div className="flex flex-col w-[250px] overflow-y-auto scroll-smooth border border-[var(--border-muted)] border-b-0">
			<h2 className="border border-[var(--border-muted)] py-2 h-12 text-center text-2xl font-bold">
				Chats
			</h2>

			{/* contacts */}
			<div className="flex-1 p-2">
				<div
					// key={}
					// onClick={handleSelected}
					className={`px-5 py-2 text-lg font-semibold shadow-xs hover:text-[var(--text)] hover:bg-[var(--bg-light)]
				cursor-pointer transition-all duration-150 ${
					selected ? "text-[var(--text)]" : "text-[var(--text-muted)]"
				}`}>
					adams
				</div>
				<div
					// onClick={handleSelected}
					className={`px-5 py-2 text-lg font-semibold shadow-xs hover:text-[var(--text)] hover:bg-[var(--bg-light)]
				cursor-pointer transition-all duration-150 ${
					selected ? "text-[var(--text)]" : "text-[var(--text-muted)]"
				}`}>
					evans
				</div>
				<div
					// onClick={handleSelected}
					className={`px-5 py-2 text-lg font-semibold shadow-xs hover:text-[var(--text)] hover:bg-[var(--bg-light)]
				cursor-pointer transition-all duration-150 ${
					selected ? "text-[var(--text)]" : "text-[var(--text-muted)]"
				}`}>
					lilian
				</div>
			</div>
			<p>me</p>
		</div>
	);
}

export default Sidebar;
