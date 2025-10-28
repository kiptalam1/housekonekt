import type { Socket, Server } from "socket.io";
import { PrismaClient } from "../../generated/prisma/client.js";
const prisma = new PrismaClient();

type JoinDMData = {
	userId: string;
	ownerId: string;
};

type SendDMData = {
	senderId: string;
	receiverId: string;
	content: string;
};

export function handleDMs(io: Server, socket: Socket): void {
	// join room for two users (owner + user);
	socket.on("join_dm", ({ userId, ownerId }: JoinDMData) => {
		const roomId = `dm-${[userId, ownerId].sort().join("-")}`;
		socket.join(roomId);
	});

	// send message;
	socket.on(
		"send_dm",
		async ({ senderId, receiverId, content }: SendDMData) => {
			try {
				const roomId = `dm-${[senderId, receiverId].sort().join("-")}`;

				// save message to DB;
				const message = await prisma.message.create({
					data: {
						senderId,
						receiverId,
						content,
					},
				});

				//emit to both;
				io.to(roomId).emit("receive_dm", message);
			} catch (error) {
				console.error("DM error:", error);
				socket.emit("dm_error", { message: "Failed to send message" });
			}
		}
	);
}
