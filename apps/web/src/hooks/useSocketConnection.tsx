import { useEffect } from "react";
import { socket } from "../socket.ts";

const useSocketConnection = () => {
	useEffect(() => {
		socket.on("connect", () => {
			console.log("✅ Connected to Socket:", socket.id);
		});

		socket.on("disconnect", () => {
			console.log("❌ Disconnected");
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
		};
	}, []);
};

export default useSocketConnection;
