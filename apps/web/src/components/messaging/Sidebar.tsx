import { useEffect, useState } from "react";
import api from "../../api";
import { AxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth";

type Chat = {
	id: string;
	username: string;
	email: string;
	role: "ADMIN" | "OWNER" | "USER";
	createdAt: string;
	updatedAt: string;
	avatarUrl?: string;
	bio: string | null;
	isVerified: boolean;
	lastLogin: string;
	phone: string | null;
};

function Sidebar({
	onSelectChat,
	unread,
	setUnread,
}: {
	unread: Record<string, boolean>;
	setUnread: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	onSelectChat: (userId: string) => void;
}) {
	const [selected, setSelected] = useState<string | null>(null);
	const [chatsList, setChatsList] = useState<Chat[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();

	useEffect(() => {
		if (!user) return;
		const fetchUserChats = async () => {
			setLoading(true);
			try {
				const res = (await api.get("/messages")).data;
				if (!res) throw new Error("Failed to fetch chats");
				setChatsList(res.data || []);
			} catch (error) {
				console.error("Failed to fetch chat history");
				setError(
					error instanceof AxiosError
						? error.response?.data.error
						: "Failed to fetch chats"
				);
			} finally {
				setLoading(false);
			}
		};
		fetchUserChats();
	}, [user]);

	const handleSelect = (id: string) => {
		setSelected(id);
		onSelectChat(id);

		if (unread[id]) {
			setUnread((prev) => ({ ...prev, [id]: false }));
		}
	};

	return (
		<div className="flex flex-col w-[250px] lg:w-[350px] overflow-y-auto scroll-smooth border border-[var(--border-muted)] border-b-0">
			<h2 className="border border-[var(--border-muted)] py-2 h-12 text-center text-2xl font-bold">
				Chats
			</h2>

			{/* contacts */}
			<div className="flex-1 p-2">
				{error && (
					<p className="text-center text-sm text-[var(--text-muted)]">
						{error}
					</p>
				)}

				{loading && <div className=" text-sm px-5 py-2">Loading...</div>}

				{!loading && chatsList?.length === 0 && <p>No chats yet</p>}
				{!loading &&
					chatsList &&
					chatsList.length > 0 &&
					chatsList.map((chat) => (
						<div
							key={chat.id}
							onClick={() => handleSelect(chat.id)}
							className={`px-5 py-2 text-lg font-semibold shadow-xs cursor-pointer transition-all duration-150 ${
								selected === chat.id
									? "bg-[var(--bg-light)] text-[var(--text)]"
									: "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-light)]"
							}`}>
							<span>{chat.username}</span>
							{unread[chat.id] && (
								<span className="ml-2 text-red-500 font-bold animate-pulse">
									&#x25CF;
								</span>
							)}
						</div>
					))}
			</div>
			<p>me</p>
		</div>
	);
}

export default Sidebar;
