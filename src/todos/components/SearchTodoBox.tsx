"use client";

import { Todo } from "@/todos/types";
import { useTodos } from "@/todos/useTodos";
import dayjs from "dayjs";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";

const SearchTodoBox = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const { todosQuery } = useTodos();
  const todos = todosQuery.data;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    const results = todos?.filter(
      (todo) =>
        todo.todo_title?.toLowerCase().includes(searchInput.toLowerCase()) ||
        todo.todo_description?.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredTodos(results || []);
    setSearchInput("");
  };

  return (
    <div>
      <div>
        <IoIosSearch className="w-[24px] h-[24px]" />
        <form>
          <input type="text" placeholder="투두 제목 또는 내용" value={searchInput} onChange={handleChange} />
          <button onClick={handleSearch} disabled={searchInput.length === 0}>
            검색
          </button>
        </form>
      </div>
      <div>
        <h3>검색 결과</h3>
        <ul className="list-disc list-inside">
          {filteredTodos ? (
            filteredTodos.map((todo) => (
              <li
                key={todo.todo_id}
                className="flex items-center"
                //   onClick={router.push("/")}
              >
                <p>{todo.todo_title}</p>
                <p>{todo.todo_description}</p>
                <p>{dayjs(todo.event_datetime).format("A hh:mm")}</p>
              </li>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchTodoBox;
