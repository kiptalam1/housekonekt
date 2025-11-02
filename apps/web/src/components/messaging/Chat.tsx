import { ArrowLeft, SendHorizontal } from "lucide-react";
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { socket } from "../../socket";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";
import { AxiosError } from "axios";
import { AVATAR_PLACEHOLDER_SVG } from "../../utils/common";

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

function Chat({
	selectedUser,
	onBack,
	isMobile,
}: {
	selectedUser: string | null;
	onBack: () => void;
	isMobile: boolean;
}) {
	const { user } = useAuth();
	const [message, setMessage] = useState("");
	const [chats, setChats] = useState<Message[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [selectedUserInfo, setSelectedUserInfo] = useState<{
		username: string;
		avatarUrl: string;
	} | null>(null);

	function handleSend(
		e?: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
	) {
		e?.preventDefault();

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
		if (!user) return;

		const handleReceive = (msg: Message) => {
			// ignore messages i sent;
			if (msg.senderId === user.id) return;
			// check if messages belong to current open convo;
			const belongs =
				(msg.senderId === selectedUser && msg.receiverId === user.id) ||
				(msg.senderId === user.id && msg.receiverId === selectedUser);

			if (!belongs) {
				return;
			}
			setChats((prev) => {
				if (msg.id && prev.some((m) => m.id === msg.id)) return prev;
				return [...prev, msg];
			});
		};
		socket.on("receive_dm", handleReceive);

		return () => {
			socket.off("receive_dm", handleReceive);
		};
	}, [user, selectedUser]);

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

	useEffect(() => {
		const timeout = setTimeout(() => {
			document
				.getElementById("chat-end")
				?.scrollIntoView({ behavior: "smooth" });
		}, 50);

		return () => clearTimeout(timeout);
	}, [chats]);

	return selectedUser ? (
		<div className="flex flex-col flex-1 sm:px-2 w-full">
			<div className="w-full text-xl font-semibold py-2 px-2 sm:px-5 h-12 border border-[var(--border-muted)] flex items-center gap-16">
				{isMobile && (
					<button
						type="button"
						onClick={onBack}
						className="text-sm flex items-center gap-1 cursor-pointer">
						<ArrowLeft size={18} absoluteStrokeWidth />
						Back
					</button>
				)}
				<div className="flex items-center gap-2 justify-center">
					<img
						src={selectedUserInfo?.avatarUrl || AVATAR_PLACEHOLDER_SVG}
						alt={selectedUserInfo?.username || "Avatar"}
						className="rounded-full w-8 h-8 object-cover"
					/>
					<p>
						{selectedUserInfo ? selectedUserInfo.username : "No chat selected"}
					</p>
				</div>
			</div>

			{/* chats */}
			<div className="flex-1 flex flex-col overflow-y-auto scrollbar-none sm:p-2 w-full pb-4">
				<div className="flex-1 flex flex-col gap-1 py-4 sm:p-5">
					{error && (
						<p className="text-center text-sm text-[var(--text-muted)]">
							{error}
						</p>
					)}
					{chats &&
						chats.length > 0 &&
						chats.map((chat, index) => {
							const isSender = chat.senderId === user?.id;
							const isLast = chats.length - 1 === index;
							return (
								<div
									key={chat.id}
									className={`py-1 px-4 max-w-5/6 sm:max-w-2/3 overflow-y-auto scrollbar-none rounded-2xl border ${
										isSender
											? "self-end bg-[var(--highlight)] border-none"
											: "self-start border border-[var(--border-muted)]"
									}`}>
									{chat.content}
									{isLast && (
										<p className="text-right mt-1 text-xs text-[var(--primary)] italic">
											{isSender
												? "~You"
												: `~${selectedUserInfo?.username.slice(0, 10)}`}
										</p>
									)}
								</div>
							);
						})}
					<div id="chat-end" />
				</div>

				{selectedUser && (
					<div className="sticky bottom-0 left-0 w-full bg-[var(--bg)] px-1">
						<form
							onSubmit={handleSend}
							className="flex items-center gap-2 w-full max-w-3xl mx-auto">
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
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSend();
									}
								}}
								className="flex-1 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg-light)] px-4 py-1 text-lg placeholder:text-[var(--text-muted)] placeholder:text-sm placeholder:italic
							focus:ring-2 focus:ring-[var(--info)] focus:outline-none scrollbar-thin hide-scrollbar max-h-[150px]"></textarea>
							<button
								type="submit"
								disabled={!message.trim()}
								aria-label="send message"
								className="text-[var(--primary)] cursor-pointer shrink-0 hover:text-[var(--highlight)] transition-all duration-150">
								<SendHorizontal size={isMobile ? 22 : 28} absoluteStrokeWidth />
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	) : (
		<div className="flex flex-1 items-center justify-center text-[var(--text-muted)]">
			Select a conversation to start chatting
		</div>
	);
}

export default Chat;
