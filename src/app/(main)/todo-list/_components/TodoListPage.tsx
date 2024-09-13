"use client";

import { useMemo, useState } from "react";
import { TodoFormData } from "./TodoForm";
import { useTodos } from "../../../../hooks/useTodos";
import dayjs from "dayjs";
import TodoListContainer from "./TodoListContainer";
import AddTodoDrawer from "./AddTodoDrawer";
import { useUserData } from "@/hooks/useUserData";
import Calendar, { CalendarEvent } from "@/components/Calendar";

const TodoListPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data } = useUserData();
  const userId = data?.user_id;
  const { addTodo, todosQuery } = useTodos(userId!);
  const todos = todosQuery.data;

  const events: CalendarEvent[] = useMemo(() => {
    return (
      todos?.map((todo) => ({
        date: new Date(todo.event_datetime ?? todo.created_at),
        done: todo.is_done ?? undefined
      })) ?? []
    );
  }, [todos]);

  // AddTodoDrawer.tsx로 분리하기
  const handleAddTodoSubmit = async (data: TodoFormData): Promise<void> => {
    const eventDateTime = data.eventTime
      ? dayjs(selectedDate).set("hour", data.eventTime[0]).set("minute", data.eventTime[1]).toISOString()
      : dayjs(selectedDate).set("hour", 0).set("minute", 0).toISOString();

    await addTodo({
      todo_title: data.title,
      todo_description: data.description,
      event_datetime: eventDateTime,
      address: data.address,
      is_chat: false,
      is_all_day_event: data.eventTime === null
    });
  };
  // ============================

  return (
    <div className="w-full h-max desktop:h-full bg-gray-100 pt-[4.5rem] inline-flex flex-col items-center gap-6 desktop:flex-row desktop:items-start desktop:justify-center desktop:pt-[5.375rem]">
      <Calendar
        selectedDate={selectedDate}
        onChange={(selected) => setSelectedDate(selected)}
        events={events}
        initialCollapsed={true}
        color={"pai"}
        className="w-full desktop:h-full max-w-[31.8rem] desktop:flex desktop:items-center desktop:justify-center desktop:pb-[100px] desktop:ml-[2.25rem]"
      />
      <TodoListContainer todos={todos ?? []} selectedDate={selectedDate} onSubmit={handleAddTodoSubmit} />
      <AddTodoDrawer onSubmit={handleAddTodoSubmit} selectedDate={selectedDate} />
    </div>
  );
};

export default TodoListPage;
