import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const PORT = process.env.PORT;

// middleware;

// routes;
app.get("/", (_req: Request, res: Response) => {
	res.send("Welcome to HouseKonekt");
});
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
