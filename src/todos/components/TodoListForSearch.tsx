"use client";

import SearchListBox from "@/components/SearchListBox";
import { useUserData } from "@/hooks/useUserData";
import { getDateYear } from "@/lib/utils/getDateYear";
import { useTodos } from "@/todos/useTodos";
import dayjs from "dayjs";
import { useMemo } from "react";
import SearchListBoxSkeleton from "./SearchListBoxSkeleton";

interface TodoListForSearchProps {
  searchQuery: string;
}

const TodoListForSearch = ({ searchQuery }: TodoListForSearchProps) => {
  const { data } = useUserData();
  const userId = data?.user_id;
  const { todosQuery } = useTodos(userId!);
  const { data: todos, isPending, isSuccess, error } = todosQuery;

  const displayedTodos = useMemo(() => {
    if (!todos) return [];
    if (!searchQuery.trim()) return todos; // 검색어 없으면 모든 채팅 반환
    const results = todos?.filter(
      (todo) =>
        todo.todo_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.todo_description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return results;
  }, [todos, searchQuery]);

  if (isPending) {
    return <SearchListBoxSkeleton />;
  }

  if (error) {
    return <div>Error : {error?.message}</div>;
  }

  return (
    <div>
      <div></div>
      <div>
        {isSuccess && todos.length > 0 ? (
          <ul className="h-full overflow-y-auto max-h-[calc(100vh-130px)]">
            {displayedTodos?.map((todo, index) => {
              const { todo_id, todo_title, todo_description, event_datetime } = todo;
              const dateYear = getDateYear(dayjs(event_datetime).toString());
              return (
                <SearchListBox
                  key={index}
                  id={todo_id}
                  title={todo_title ?? ""}
                  description={todo_description ?? ""}
                  dateYear={dateYear}
                />
              );
            })}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default TodoListForSearch;
