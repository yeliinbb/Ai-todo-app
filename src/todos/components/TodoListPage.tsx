"use client";

import Calendar, { CalendarEvent } from "@/shared/ui/Calendar";
import TodoList from "./TodoList";
import { Todo } from "../types";
import { useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";
import useselectedCalendarStore from "@/store/selectedCalendar.store";

interface TodoListPageProps {
  todos: Todo[];
}
const TodoListPage = ({ todos }: TodoListPageProps) => {
  // const [selectedDate, setSelected] = useState<Date>(new Date());
  const { selectedDate, setSelectedDate } = useselectedCalendarStore();
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
      <Calendar events={events} />
      <TodoList todos={todos} />
    </div>
  );
};

export default TodoListPage;
