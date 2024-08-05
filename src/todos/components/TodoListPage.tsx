"use client";

import Calendar, { CalendarEvent } from "@/shared/ui/Calendar";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TodoFormData } from "./AddTodoForm";
import { useTodos } from "../useTodos";
import dayjs from "dayjs";
import TodoListContainer from "./TodoListContainer";
import AddTodoDrawer from "./AddTodoDrawer";

const TodoListPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { addTodo } = useTodos();
  const { todosQuery } = useTodos();
  const todos = todosQuery.data;
  const router = useRouter();

  const events: CalendarEvent[] = useMemo(() => {
    return (
      todos?.map((todo) => ({
        date: new Date(todo.event_datetime ?? todo.created_at),
        done: todo.is_done ?? undefined
      })) ?? []
    );
  }, [todos]);

  // AddTodoModal.tsx로 분리하기
  const handleAddTodoSubmit = async (data: TodoFormData): Promise<void> => {
    const eventDateTime = data.eventTime
      ? dayjs(selectedDate).set("hour", data.eventTime[0]).set("minute", data.eventTime[1]).toISOString()
      : null;

    await addTodo({
      todo_title: data.title,
      todo_description: data.description,
      event_datetime: eventDateTime,
      is_chat: false
    });
  };
  // ============================

  return (
    <div>
      <Calendar
        selectedDate={selectedDate}
        onChange={(selected) => setSelectedDate(selected)}
        events={events}
        initialCollapsed={true}
      />
      <TodoListContainer todos={todos ?? []} selectedDate={selectedDate} onSubmit={handleAddTodoSubmit} />
      <AddTodoDrawer onSubmit={handleAddTodoSubmit} selectedDate={selectedDate} />
    </div>
  );
};

export default TodoListPage;
