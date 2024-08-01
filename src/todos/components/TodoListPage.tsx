"use client";

import Calendar, { CalendarEvent } from "@/shared/ui/Calendar";
import TodoList from "./TodoList";
import { Todo } from "../types";
import { useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";
import AddToDoForm, { AddTodoFormProps } from "./AddTodoForm";
import { useTodos } from "../useTodos";
import dayjs from "dayjs";

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

  // AddTodoDrawer.tsx로 분리하기
  const handleAddTodoSubmit: AddTodoFormProps["onSubmit"] = async (data) => {
    const eventDateTime = data.eventTime
      ? dayjs(selectedDate).set("hour", data.eventTime[0]).set("minute", data.eventTime[1]).toISOString()
      : null;

    await addTodo({
      todo_title: data.title,
      todo_description: data.description,
      event_datetime: eventDateTime
    });
    alert("성공!");
  };
  // ============================

  return (
    <div className="bg-gray-100">
      <IoIosSearch className="w-[24px] h-[24px]" onClick={() => router.push("/todo-list/search")} />
      <Calendar selectedDate={selectedDate} onChange={(selected) => setSelectedDate(selected)} events={events} />
      <TodoList todos={todos ?? []} selectedDate={selectedDate} />
      <AddToDoForm onSubmit={handleAddTodoSubmit} />
    </div>
  );
};

export default TodoListPage;
