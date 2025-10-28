import { useEffect } from "react";
import { socket } from "../socket.ts";
import { useAuth } from "./useAuth.tsx";

const useSocketConnection = () => {
	const { user } = useAuth();

	useEffect(() => {
		if (!user) return;

		socket.connect();
		socket.on("connect", () => {
			console.log("✅ Connected to Socket:", socket.id);
			socket.emit("register", user.id);
		});

		socket.on("disconnect", () => {
			console.log("❌ Disconnected");
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.disconnect();
		};
	}, [user]);
};

export default useSocketConnection;
