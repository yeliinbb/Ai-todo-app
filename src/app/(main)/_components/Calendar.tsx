"use client";

import TodoList from "../todo-list/_components/TodoList";
import { useTodos } from "@/utils/todoApi";

const Calendar = () => {
  const { todosQuery, addTodo, updateTodo, deleteTodo } = useTodos();

  if (todosQuery.isLoading) return <div>Loading...</div>;
  if (todosQuery.isError) return <div>Error: {todosQuery.error.message}</div>;

  return <TodoList todos={todosQuery.data || []} addTodo={addTodo} updateTodo={updateTodo} deleteTodo={deleteTodo} />;
};

export default Calendar;
