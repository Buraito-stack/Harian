import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { healthRouter } from "./routes/health";
import { todosRouter } from "./routes/todos";
import { authRouter } from "./routes/auth";
import postsRouter from "./routes/posts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/todos", todosRouter);
app.use("/auth", authRouter);
app.use("/posts", postsRouter);

const port = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
app.listen(port, () => {
  // Simple log for local dev
  console.log(`API listening on http://localhost:${port}`);
});
