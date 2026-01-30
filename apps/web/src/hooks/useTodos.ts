import { useCallback, useEffect, useState } from "react";
import type { Todo, CreateTodoPayload, UpdateTodoPayload, ApiResponse } from "../types";

// ============================================
// useTodos Hook - Professional Todo Management
// ============================================

const API_BASE = "http://localhost:4000";

interface UseTodosOptions {
  autoFetch?: boolean;
}

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchTodos: () => Promise<void>;
  addTodo: (payload: CreateTodoPayload) => Promise<Todo | null>;
  updateTodo: (id: string, payload: UpdateTodoPayload) => Promise<Todo | null>;
  deleteTodo: (id: string) => Promise<boolean>;
  toggleTodo: (id: string) => Promise<void>;
  // Computed
  completedCount: number;
  activeCount: number;
  clearError: () => void;
}

// Demo data for offline/dev mode
const DEMO_TODOS: Todo[] = [
  {
    id: "demo-1",
    title: "Check friend notifications",
    description: "See what's new in the feed",
    completed: false,
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Create today's post",
    completed: true,
    priority: "high",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "Review weekly goals",
    description: "Plan for the upcoming week",
    completed: false,
    priority: "low",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useTodos(options: UseTodosOptions = {}): UseTodosReturn {
  const { autoFetch = true } = options;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/todos`);
      if (!res.ok) throw new Error("Failed to fetch todos");

      const json: ApiResponse<Todo[]> = await res.json();
      setTodos(json.data ?? []);
    } catch (err) {
      setError((err as Error).message);
      // Fallback to demo data when backend is not available
      setTodos(DEMO_TODOS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (payload: CreateTodoPayload): Promise<Todo | null> => {
    // Optimistic update
    const optimisticTodo: Todo = {
      id: crypto.randomUUID(),
      title: payload.title,
      description: payload.description,
      completed: false,
      priority: payload.priority ?? "medium",
      dueDate: payload.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTodos((prev) => [optimisticTodo, ...prev]);

    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create todo");

      const json: ApiResponse<Todo> = await res.json();
      // Replace optimistic with server response
      setTodos((prev) => [
        json.data,
        ...prev.filter((t) => t.id !== optimisticTodo.id),
      ]);
      return json.data;
    } catch (err) {
      // Keep optimistic update for offline mode
      setError((err as Error).message);
      return optimisticTodo;
    }
  }, []);

  const updateTodo = useCallback(
    async (id: string, payload: UpdateTodoPayload): Promise<Todo | null> => {
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t
        )
      );

      try {
        const res = await fetch(`${API_BASE}/todos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update todo");

        const json: ApiResponse<Todo> = await res.json();
        setTodos((prev) => prev.map((t) => (t.id === id ? json.data : t)));
        return json.data;
      } catch (err) {
        setError((err as Error).message);
        return null;
      }
    },
    []
  );

  const deleteTodo = useCallback(async (id: string): Promise<boolean> => {
    // Optimistic update
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete todo");
      }
      return true;
    } catch (err) {
      setError((err as Error).message);
      // Re-fetch to restore state on failure
      await fetchTodos();
      return false;
    }
  }, [fetchTodos]);

  const toggleTodo = useCallback(
    async (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        await updateTodo(id, { completed: !todo.completed });
      }
    },
    [todos, updateTodo]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchTodos();
    }
  }, [autoFetch, fetchTodos]);

  // Computed values
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    completedCount,
    activeCount,
    clearError,
  };
}
