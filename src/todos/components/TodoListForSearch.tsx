"use client";

import SearchListBox from "@/components/SearchListBox";
import { getDateYear } from "@/lib/utils/getDateYear";
import { useTodos } from "@/todos/useTodos";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

interface TodoListForSearchProps {
  searchQuery: string;
}

const TodoListForSearch = ({ searchQuery }: TodoListForSearchProps) => {
  const [searchInput, setSearchInput] = useState<string>("");
  // const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const { todosQuery } = useTodos();
  const { data: todos, isPending, isSuccess, error } = todosQuery;

  // const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchInput(e.target.value);
  // };

  // const handleSearch = (searchInput: string) => {
  //   const results = todos?.filter(
  //     (todo) =>
  //       todo.todo_title?.toLowerCase().includes(searchInput.toLowerCase()) ||
  //       todo.todo_description?.toLowerCase().includes(searchInput.toLowerCase())
  //   );
  //   setFilteredTodos(results || []);
  //   setSearchInput("");
  // };

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

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   handleSearch(searchInput);
  // };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error : {error?.message}</div>;
  }

  return (
    <div>
      <div>
        {/* <form>
          <input type="text" placeholder="투두 제목 또는 내용" value={searchInput} onChange={handleChange} />
          <button onClick={handleSearch} disabled={searchInput.length === 0}>
            검색
          </button>
        </form> */}
        {/* <SearchInput handleSubmit={handleSubmit} inputValue={searchInput} handleChangeSearch={handleChangeSearch} /> */}
      </div>
      <div>
        {isSuccess && todos.length > 0 ? (
          <ul className="list-disc list-inside">
            {displayedTodos?.map((todo, index) => {
              const { todo_id, todo_title, todo_description, event_datetime } = todo;
              const dateYear = getDateYear(dayjs(event_datetime).toISOString());
              return (
                //   <li
                //   key={todo.todo_id}
                //   className="flex items-center"
                //   //   onClick={router.push("/")}
                // >
                //   <p>{todo.todo_title}</p>
                //   <p>{todo.todo_description}</p>
                //   <p>{dayjs(todo.event_datetime).format("A hh:mm")}</p>
                //   </li>
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
