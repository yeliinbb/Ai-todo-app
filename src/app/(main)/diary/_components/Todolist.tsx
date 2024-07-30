"use client";
import { TodoListType } from "@/types/diary.type";
import { useRouter } from "next/navigation";

interface TodolistProps {
  todos: TodoListType[];
}

const Todolist: React.FC<TodolistProps> = ({ todos }) => {
  const route = useRouter();
  const handleButtonClick = (todo: TodoListType) => {
    if (todo.address && todo.address.lat && todo.address.lng && (todo.address.lat !== 0 || todo.address.lng !== 0)) {
      route.push(`/diary/diary-map/${todo.todo_id}?lat=${todo.address.lat}&lng=${todo.address.lng}`);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          route.push(`/diary/diary-map/${todo.todo_id}?lat=${latitude}&lng=${longitude}`);
        },
        (error) => {
          console.error("Failed to get location", error);
        }
      );
    }
  };
  return (
    <div className="border-r border-l border-slate-300 p-4">
      <div>
        {todos.map((todo) => (
          <div key={todo.todo_id} className="border border-slate-300 p-4 mb-4 rounded shadow-sm flex justify-between">
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
  );
};

export default Todolist;
