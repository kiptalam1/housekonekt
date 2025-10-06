import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
// functions;
import  authRoutes from "./routes/auth.routes.js"
const app = express();

const PORT = process.env.PORT;

// middleware;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes;
app.get("/", (_req: Request, res: Response) => {
	res.send("Welcome to HouseKonekt");
});

app.use("/api/auth", authRoutes);
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
