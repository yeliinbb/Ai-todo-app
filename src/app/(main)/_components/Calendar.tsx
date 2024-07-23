"use client";

import { supabase } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import TodoList from "../todo-list/_components/TodoList";

interface Todo {
  todo_id: string;
  user_id: string;
  todo_title: string;
  todo_description?: string;
  event_datetime: Date;
  address?: {
    lat: number;
    lng: number;
  };
  is_done: boolean;
  created_at: Date;
}

const Calendar = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("todos").select("*");
    if (error) {
      setError(error.message);
    } else {
      setTodos(data);
    }
    setLoading(false);
  };

  const addTodo = async (todo: Omit<Todo, "todo_id">) => {
    const { data, error } = await supabase.from("todos").insert(todo);
    if (error) {
      setError(error.message);
    } else {
      setTodos([...todos, ...data]);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <TodoList todos={todos} addTodo={addTodo} />;
};

export default Calendar;
