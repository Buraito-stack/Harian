import { randomUUID } from "crypto";
import { Router } from "express";
import { z } from "zod";

// In-memory store for now; replace with Prisma when DB is ready.
const todos = new Map<string, { id: string; title: string; completed: boolean }>();

const createTodoSchema = z.object({ title: z.string().min(1) });
const updateTodoSchema = z.object({ completed: z.boolean().optional(), title: z.string().min(1).optional() });

export const todosRouter = Router();

todosRouter.get("/", (_req, res) => {
  res.json({ data: Array.from(todos.values()) });
});

todosRouter.post("/", (req, res) => {
  const parsed = createTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const id = randomUUID();
  const todo = { id, title: parsed.data.title, completed: false };
  todos.set(id, todo);
  res.status(201).json({ data: todo });
});

todosRouter.patch("/:id", (req, res) => {
  const parsed = updateTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const id = req.params.id;
  const existing = todos.get(id);
  if (!existing) {
    return res.status(404).json({ error: "Not found" });
  }

  const updated = {
    ...existing,
    ...parsed.data,
  };
  todos.set(id, updated);
  res.json({ data: updated });
});

todosRouter.delete("/:id", (req, res) => {
  const id = req.params.id;
  if (!todos.has(id)) {
    return res.status(404).json({ error: "Not found" });
  }
  todos.delete(id);
  res.status(204).send();
});
