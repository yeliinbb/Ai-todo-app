"use client";

import Calendar, { CalendarEvent } from "@/shared/ui/Calendar";
import TodoList from "./TodoList";
import { Todo } from "../types";
import { useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";

interface TodoListPageProps {
  todos: Todo[];
}
const TodoListPage = ({ todos }: TodoListPageProps) => {
  const [selectedDate, setSelected] = useState<Date>(new Date());
  const events: CalendarEvent[] = useMemo(() => {
    return todos.map((todo) => ({
      date: new Date(todo.event_datetime ?? todo.created_at),
      done: todo.is_done ?? undefined
    }));
  }, [todos]);
  const router = useRouter();

  return (
    <div className="bg-gray-100">
      <IoIosSearch className="w-[24px] h-[24px]" onClick={() => router.push("/todo-list/search")} />
      <Calendar selectedDate={selectedDate} onChange={(selected) => setSelected(selected)} events={events} />
      <TodoList todos={todos} selectedDate={selectedDate} />
    </div>
  );
};

export default TodoListPage;
