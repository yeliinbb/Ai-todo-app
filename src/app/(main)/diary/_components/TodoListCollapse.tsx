import { TodoListType } from "@/types/diary.type";

interface TodoListCollapseProps {
  todosData?: TodoListType[];
  isCollapsed: boolean;
  handleToggle: () => void;
}

const TodoListCollapse: React.FC<TodoListCollapseProps> = ({ todosData, isCollapsed, handleToggle }) => {
  return (
    <>
      {todosData?.length !== 0 ? (
        <>
          <p onClick={handleToggle} className="cursor-pointer text-blue-600 font-semibold w-max">
            투두 리스트 {isCollapsed ? <span>▲</span> : <span>▼</span>}
          </p>
          <div
            className={`transition-transform duration-500 ease-in-out overflow-hidden ${
              isCollapsed ? "max-h-0 transform -translate-y-4" : "max-h-screen transform translate-y-0"
            }`}
          >
            {!isCollapsed && todosData && todosData.length > 0 && (
              <div className="mt-2 p-2 border border-gray-300 rounded-lg bg-gray-50">
                <h5 className="text-md font-semibold">To-Do List:</h5>
                <ul>
                  {todosData.map((todo) => (
                    <li key={todo.event_datetime} className="p-1 border-b border-gray-200">
                      {todo.todo_title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>투두 리스트 없습니다.</div>
      )}
    </>
  );
};

export default TodoListCollapse;
