"use client";

import SearchListBox from "@/components/search/SearchListBox";
import { useUserData } from "@/hooks/useUserData";
import { getDateYear } from "@/lib/utils/getDateYear";
import { useTodos } from "@/todos/useTodos";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import SearchListBoxSkeleton from "../../components/search/SearchListBoxSkeleton";
import NoSearchResult from "@/components/search/NoSearchResult";
import TodoDetailDrawer from "./TodoDetailDrawer";
import { Todo } from "../types";

interface DrawerStates {
  open: boolean;
  todo?: Todo;
  editing?: boolean;
}

interface TodoListForSearchProps {
  searchQuery: string;
}

const TodoListForSearch = ({ searchQuery }: TodoListForSearchProps) => {
  const { data } = useUserData();
  const userId = data?.user_id;
  const { todosQuery } = useTodos(userId!);
  const { data: todos, isPending, isSuccess, error } = todosQuery;
  const [drawerStates, setDrawerStates] = useState<DrawerStates>({ open: false });

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

  // if (isPending) {
  //   return <SearchListBoxSkeleton />;
  // }

  if (error) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      {displayedTodos.length > 0 ? (
        <ul className="flex-grow overflow-y-auto scrollbar-hide scroll-smooth max-h-[calc(100vh-225px)] desktop:max-h-[calc(100vh-170px)] px-4 mobile:mt-7 desktop:mt-7 desktop:pr-5 desktop:pl-[52px]">
          {isPending && <SearchListBoxSkeleton />}
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
                onClick={() => setDrawerStates({ open: true, todo })}
              />
            );
          })}
        </ul>
      ) : (
        <div className="flex-grow flex items-center justify-center mb-40">
          <NoSearchResult />
        </div>
      )}
      {drawerStates.todo && (
        <TodoDetailDrawer
          todo={drawerStates.todo}
          open={drawerStates.open}
          onClose={() => setDrawerStates((prev) => ({ open: false, todo: prev.todo }))}
          editing={drawerStates.editing ?? false}
          onChangeEditing={(v) => setDrawerStates((prev) => ({ ...prev, editing: v }))}
        />
      )}
    </div>
  );
};

export default TodoListForSearch;
