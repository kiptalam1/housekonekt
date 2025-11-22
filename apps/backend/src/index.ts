import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
import { Server } from "socket.io";
import { createServer } from "http";
import morgan from "morgan";
// functions;
import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { assignVisitorId } from "./middlewares/visitorId.middlewares.js";
import { handleDMs } from "./socket/DMsHandler.js";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const PORT = process.env.PORT;

// middleware;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(assignVisitorId);
app.use(
	cors({
		origin: [
			"https://housekonekt.onrender.com",

			// "http://localhost:3000"
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(morgan("common"));
// routes;
app.get("/", (_req: Request, res: Response) => {
	res.send("Welcome to HouseKonekt");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);


//socket.io;
io.on("connection", (socket) => {
	console.log("user connected:", socket.id);

	socket.on("user_online", (userId: string) => {
		if (!userId) return;

		socket.join(`user-${userId}`); // personal room;
		socket.data.userId = userId;

		console.log(`User ${userId} joined room user-${userId}`);
	});

	socket.on("user_offline", (userId: string) => {
		if (!userId) return;

		socket.leave(`user-${userId}`);
		socket.data.userId = null;

		console.log(`User ${userId} left room user-${userId}`);
	});

	handleDMs(io, socket);

	socket.on("disconnect", () => {
		console.log(`user disconnected: ${socket.data.userId || socket.id}`);
	});
});

httpServer.listen(PORT, () => console.log(`Server running at port ${PORT}`));
