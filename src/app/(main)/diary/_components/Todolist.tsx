"use client";

import updateAddress from "@/lib/utils/diaries/updateAddress";
import { TodoListType } from "@/types/diary.type";
import { useRouter } from "next/navigation";

interface TodolistProps {
  todos: TodoListType[];
}

const Todolist: React.FC<TodolistProps> = ({ todos }) => {
  const route = useRouter();

  const handleButtonClick = (todo: TodoListType) => {
    updateAddress(todo, route);
  };

  return (
    <>
      {todos.length > 0 ? (
        <div className="border-r border-l border-slate-300 p-4">
          <div>
            {todos.map((todo) => (
              <div
                key={todo.todo_id}
                className="border border-slate-300 p-4 mb-4 rounded shadow-sm flex justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold">{todo.todo_title}</h2>
                  <p className="text-sm text-gray-600">{todo.todo_description}</p>
                </div>
                <div className="mt-2">
                  {todo.address && todo.address.lat && todo.address.lng ? (
                    <button className="text-green-500 hover:underline" onClick={() => handleButtonClick(todo)}>
                      장소 보기
                    </button>
                  ) : (
                    <button className="text-blue-500 hover:underline" onClick={() => handleButtonClick(todo)}>
                      장소 추가
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>투두리스트 없습니다.</div>
      )}
    </>
  );
};

export default Todolist;
