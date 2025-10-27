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
import { assignVisitorId } from "./middlewares/visitorId.middlewares.js";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
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
		origin: ["http://localhost:3000"],
		credentials: true,
	})
);
app.use(morgan("combined"));
// routes;
app.get("/", (_req: Request, res: Response) => {
	res.send("Welcome to HouseKonekt");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);

//socket.io;
io.on("connection", (socket) => {
	console.log("user connected:", socket.id);

	socket.on("disconnect", () => {
		console.log("socket disconnected:", socket.id);
	});
});

httpServer.listen(PORT, () => console.log(`Server running at port ${PORT}`));
