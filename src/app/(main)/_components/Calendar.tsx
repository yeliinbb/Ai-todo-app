"use client";

import { supabase } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import TodoList from "../todo-list/_components/TodoList";
import { Todo } from "@/types/todo.type";

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
    const { data, error } = await supabase.from("todos").insert(todo).select().single();
    if (error) {
      setError(error.message);
      return;
    }
    if (data) setTodos([...todos, data]);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <TodoList todos={todos} addTodo={addTodo} />;
};

export default Calendar;
