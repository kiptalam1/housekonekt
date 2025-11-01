import { useEffect, useState } from "react";
import Chat from "../components/messaging/Chat";
import Sidebar from "../components/messaging/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { socket } from "../socket";

export default function Messaging() {
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const [unread, setUnread] = useState<Record<string, boolean>>({});
	const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
	const [showSidebar, setShowSidebar] = useState(true);
	const { user } = useAuth();
	const [params] = useSearchParams();
	const ownerId = params.get("owner");

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 640);
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

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
		<section className="min-h-screen flex ">
			{(!isMobile || showSidebar) && (
				<Sidebar
					onSelectChat={(id) => {
						setSelectedUser(id);
						if (isMobile) setShowSidebar(false);
					}}
					unread={unread}
					setUnread={setUnread}
				/>
			)}
			{(!isMobile || !showSidebar) && (
				<Chat
					selectedUser={selectedUser}
					onBack={() => isMobile && setShowSidebar(true)}
					isMobile={isMobile}
				/>
			)}
		</section>
	);
}
