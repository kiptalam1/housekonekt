import { SendHorizontal } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { socket } from "../../socket";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";
import { AxiosError } from "axios";

type Message = {
	id?: string;
	content: string;
	createdAt: string;
	deleted: boolean;
	edited: boolean;
	readAt?: string | null;
	senderId: string;
	receiverId: string;
};

function Chat({ selectedUser }: { selectedUser: string | null }) {
	const { user } = useAuth();
	const [message, setMessage] = useState("");
	const [chats, setChats] = useState<Message[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [selectedUserInfo, setSelectedUserInfo] = useState<{
		username: string;
	} | null>(null);

	function handleSend(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!message.trim() || !user || !selectedUser) return;

		const newMessage: Message = {
			senderId: user.id,
			receiverId: selectedUser,
			content: message.trim(),
			createdAt: new Date().toISOString(),
			edited: false,
			deleted: false,
		};

		// optimistic update;
		setChats((prev) => [...prev, newMessage]);

		socket.emit("send_dm", newMessage);
		setMessage("");
	}

	useEffect(() => {
		socket.on("receive_dm", (msg) => {
			setChats((prev) => [...prev, msg]);
		});

		return () => {
			socket.off("receive_dm");
		};
	}, []);

	useEffect(() => {
		if (!selectedUser) return;
		const fetchUserInfo = async () => {
			try {
				const res = (await api.get(`/users/${selectedUser}`)).data;
				setSelectedUserInfo(res.data);
			} catch (error) {
				console.error("Failed to fetch user info", error);
			}
		};
		fetchUserInfo();
	}, [selectedUser]);
	useEffect(() => {
		if (!user || !selectedUser) return;
		setChats([]); // clear old chat
		setError(null);

		const fetchChatHistory = async () => {
			try {
				const res = (await api.get(`/messages/${selectedUser}`)).data;
				if (!res) throw new Error("Failed to fetch chat history");

				setChats(res.data || []);
			} catch (error) {
				console.error("Failed to fetch chat history");
				setError(
					error instanceof AxiosError
						? error.response?.data.error
						: "Failed to fetch chats"
				);
			}
		};
		fetchChatHistory();
	}, [user, selectedUser]);

	return (
		<div className="flex flex-col flex-1 px-2">
			<div className="w-full text-xl font-semibold py-2 px-5 h-12 border border-[var(--border-muted)] text-center">
				{selectedUserInfo ? selectedUserInfo.username : "No chat selected"}
			</div>

			{/* chats */}
			<div className="flex-1 flex flex-col overflow-y-auto p-2">
				<div className="flex-1 flex flex-col gap-1 p-5">
					{error && (
						<p className="text-center text-sm text-[var(--text-muted)]">
							{error}
						</p>
					)}
					{chats &&
						chats.length > 0 &&
						chats.map((chat, index) => (
							<div
								key={chat.id}
								className={`py-1 px-4 max-w-2/3 overflow-auto rounded-2xl border ${
									chat.receiverId === selectedUser
										? "self-end bg-[var(--highlight)] border-none"
										: "self-start border border-[var(--border-muted)]"
								}`}>
								{chat.content}
								{chat.senderId !== selectedUser &&
								chats.length - 1 === index ? (
									<p className="text-right mt-1 text-xs text-[var(--primary)]">
										~You
									</p>
								) : (
									chat.receiverId === selectedUser &&
									chats.length - 1 === chats.indexOf(chat) && (
										<p className="text-right mt-1 text-xs text-[var(--primary)]">
											{selectedUserInfo?.username}
										</p>
									)
								)}
							</div>
						))}
				</div>

				{selectedUser && (
					<form onSubmit={handleSend}>
						<div className="flex items-center gap-2">
							<textarea
								name="input-message"
								id="input-message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Type a message..."
								rows={1}
								onInput={(e) => {
									e.currentTarget.style.height = "auto";
									e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
								}}
								className="flex-1 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg-light)] px-4 py-1 text-lg placeholder:text-[var(--text-muted)] placeholder:text-sm placeholder:italic
							focus:ring-2 focus:ring-[var(--info)] focus:outline-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"></textarea>
							<button
								type="submit"
								aria-label="send message"
								className="text-[var(--primary)] cursor-pointer">
								<SendHorizontal size={28} absoluteStrokeWidth />
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

export default Chat;
