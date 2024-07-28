"use client";
import Calendar, { CalendarEvent } from "@/shared/ui/Calendar";
import TodoList from "./TodoList";
import { Todo } from "../types";
import { useState } from "react";
import dayjs from "dayjs";

interface TodoListPageProps {
  todos: Todo[];
}
const TodoListPage = ({ todos }: TodoListPageProps) => {
  const [selected, setSelected] = useState<Date>(new Date());
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const events: CalendarEvent[] = [{ date: dayjs("2024-07-01").toDate() }, { date: dayjs("2024-07-30").toDate() }];

  return (
    <div className="gap-1 flex flex-col items-start">
      <button onClick={() => setCollapsed((prev) => !prev)}>toggle</button>
      <Calendar
        selected={selected}
        onChange={(selected) => setSelected(selected)}
        events={events}
        collapsed={collapsed}
      />
      <TodoList todos={todos} selectedDate={selected} />
    </div>
  );
};

export default TodoListPage;
