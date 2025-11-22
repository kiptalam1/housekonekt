import type { Socket, Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// type JoinDMData = {
// 	userId: string;
// 	ownerId: string;
// };

type SendDMData = {
	senderId: string;
	receiverId: string;
	content: string;
};

export function handleDMs(io: Server, socket: Socket): void {
	// send message;
	socket.on(
		"send_dm",
		async ({ senderId, receiverId, content }: SendDMData) => {
			try {
				if (!senderId || !receiverId || !content) return;

				// save message to DB;
				const message = await prisma.message.create({
					data: {
						senderId,
						receiverId,
						content,
					},
				});

				//emit to both sender and receiver personal rooms;
				io.to(`user-${receiverId}`).emit("receive_dm", message);
				io.to(`user-${senderId}`).emit("receive_dm", message);

				io.to(`user-${receiverId}`).emit("new_message_notification", {
					from: message.senderId,
					preview: message.content,
				});
			} catch (error) {
				console.error("DM error:", error);
				socket.emit("dm_error", { message: "Failed to send message" });
			}
		}
	);
}
