import { useEffect, useState } from "react";
import Chat from "../components/messaging/Chat";
import Sidebar from "../components/messaging/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { socket } from "../socket";

export default function Messaging() {
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const [unread, setUnread] = useState<Record<string, boolean>>({});
	const { user } = useAuth();
	const [params] = useSearchParams();
	const ownerId = params.get("owner");

	useEffect(() => {
		if (user) {
			socket.emit("user_online", user.id);
			console.log("registered socket for:", user.id);
			setSelectedUser(ownerId);

			return () => {
				socket.emit("user_offline", user.id);
			};
		}
	}, [ownerId, user]);

	useEffect(() => {
		const handleNotification = (data: { from: string }) => {
			if (selectedUser !== data.from) {
				setUnread((prev) => ({ ...prev, [data.from]: true }));
			}
		};
		socket.on("new_message_notification", handleNotification);

		return () => {
			socket.off("new_message_notification", handleNotification);
		};
	}, [selectedUser]);

	return (
		<section className="min-h-screen  flex ">
			<Sidebar
				onSelectChat={setSelectedUser}
				unread={unread}
				setUnread={setUnread}
			/>
			<Chat selectedUser={selectedUser} />
		</section>
	);
}
