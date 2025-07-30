"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Tables } from "@/types/supabase";

export default function DashboardPage() {
  const { user, authUser, isAuthenticated, loading } = useAuth();
  const [todos, setTodos] = useState<Tables<"todos">[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [adding, setAdding] = useState(false);

  // Debug auth state
  useEffect(() => {
    console.log("Auth state:", {
      isAuthenticated,
      loading,
      user: user?.id,
      authUser: authUser?.id,
    });
  }, [isAuthenticated, loading, user?.id, authUser?.id]);

  // Fetch todos for the current user
  useEffect(() => {
    const userId = user?.id || authUser?.id;
    if (!userId) return;
    
    const fetchTodos = async () => {
      setLoadingTodos(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) setTodos(data);
      setLoadingTodos(false);
    };
    fetchTodos();
  }, [user?.id, authUser?.id]);

  // Add a new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debugging
    console.log("user.id:", user?.id);
    console.log("authUser.id:", authUser?.id);
    console.log("newTodo:", newTodo);

    // Use authUser.id directly since that's what we have
    const userId = authUser?.id;
    if (!newTodo.trim() || !userId) {
      console.log("Cannot add todo - missing userId or empty todo");
      return;
    }
    
    setAdding(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("todos")
      .insert({ title: newTodo, user_id: userId })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding todo:", error);
      alert(`Error adding todo: ${error.message}`);
    } else if (data) {
      setTodos((prev) => [data, ...prev]);
      console.log("Todo added successfully:", data);
    }
    
    setNewTodo("");
    setAdding(false);
  };

  // Toggle complete
  const handleToggle = async (todo: Tables<"todos">) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("todos")
      .update({ is_complete: !todo.is_complete })
      .eq("id", todo.id)
      .select()
      .single();
    if (!error && data) {
      setTodos((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    }
  };

  if (loading || loadingTodos) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to see your todos.</div>;

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My To-Do List</h1>
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new to-do..."
          disabled={adding}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded"
          disabled={adding || !newTodo.trim()}
        >
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {todos.length === 0 && <li className="text-gray-500">No todos yet.</li>}
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <input
              type="checkbox"
              checked={todo.is_complete}
              onChange={() => handleToggle(todo)}
              className="accent-blue-600"
            />
            <span className={todo.is_complete ? "line-through text-gray-400" : ""}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
