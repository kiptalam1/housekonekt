import Chat from "../components/messaging/Chat";
import Sidebar from "../components/messaging/Sidebar";

export default function Messaging() {
	return (
		<section className="min-h-screen  flex ">
			<Sidebar />
			<Chat />
		</section>
	);
}
