import { io } from "socket.io-client";

export const socket = io("https://housekonekt-backend.onrender.com", {
	withCredentials: true,
	autoConnect: false,
});
