"use client";

import Calendar, { CalendarEvent } from "@/shared/ui/Calendar";
import TodoList from "./TodoList";
import { Todo } from "../types";
import { useState } from "react";
import dayjs from "dayjs";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";
import AddTodoModal from "./AddTodoModal";

interface TodoListPageProps {
  todos: Todo[];
}
const TodoListPage = ({ todos }: TodoListPageProps) => {
  const [selectedDate, setSelected] = useState<Date>(new Date());
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const events: CalendarEvent[] = [{ date: dayjs("2024-07-01").toDate() }, { date: dayjs("2024-07-30").toDate() }];
  const router = useRouter();

  console.log(todos);

  return (
    <div>
      <IoIosSearch className="w-[24px] h-[24px]" onClick={() => router.push("/todo-list/search")} />
      <button className="block" onClick={() => setCollapsed((prev) => !prev)}>
        toggle
      </button>
      <Calendar
        selectedDate={selectedDate}
        onChange={(selected) => setSelected(selected)}
        events={events}
        collapsed={collapsed}
      />
      <TodoList todos={todos} selectedDate={selectedDate} />
      <AddTodoModal />
    </div>
  );
};

export default TodoListPage;
