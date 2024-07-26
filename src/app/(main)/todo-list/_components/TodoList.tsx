"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import useselectedCalendarStore from "@/store/selectedCalendar.store";

const TodoList = ({ todos, addTodo, updateTodo, deleteTodo }) => {
  const { selectedDate, setSelectedDate } = useselectedCalendarStore();
  const [showToday, setShowToday] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleCheckboxChange = (todo) => {
    const updatedTodo = { ...todo, is_done: !todo.is_done };
    updateTodo(updatedTodo);
  };

  const events = todos.map((todo) => ({
    title: todo.todo_title || "",
    start: todo.event_datetime ? dayjs(todo.event_datetime).toISOString() : ""
  }));

  const todayTodos = todos.filter(
    (todo) => !todo.is_done && dayjs(todo.event_datetime).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
  );

  const completedTodos = todos.filter((todo) => todo.is_done);

  return (
    <div className="flex flex-col items-center">
      {/* 풀캘린더 */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek"
        }}
        contentHeight="auto"
        // events={events}
        dayCellClassNames={(date) => {
          const classes = ["text-center", "p-2", "hover:bg-gray-200"];
          if (date.date.toISOString().split("T")[0] === selectedDate) {
            classes.push("rounded-full");
          }
          return classes.join(" ");
        }}
        dayCellContent={(cellInfo) => {
          const hasEvent = events.some(
            (event) => dayjs(event.start).format("YYYY-MM-DD") === cellInfo.date.toISOString().split("T")[0]
          );
          return (
            <div className="relative">
              <div>{cellInfo.dayNumberText}</div>
              {hasEvent && <span className="absolute bottom-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>}
            </div>
          );
        }}
        dateClick={(info) => {
          const title = prompt("투두를 입력하세요");
          if (title) {
            addTodo({
              user_id: "임시 유저",
              todo_title: title,
              todo_description: "",
              event_datetime: new Date(info.dateStr).toISOString(),
              address: {
                lat: 0,
                lng: 0
              },
              is_done: false,
              created_at: new Date().toISOString()
            });
          }
        }}
      />
      <div className="mt-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-2 cursor-pointer" onClick={() => setShowToday(!showToday)}>
          오늘
        </h2>
        {showToday && (
          <ul className="list-disc list-inside">
            {todayTodos.map((todo) => (
              <li key={todo.todo_id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.is_done}
                  onChange={() => handleCheckboxChange(todo)}
                  className="mr-2"
                />
                <span className={todo.is_done ? "line-through" : ""}>{todo.todo_title}</span>
                <span>{dayjs(todo.event_datetime).format("YYYY-MM-DD")}</span>
                <button onClick={() => deleteTodo(todo.todo_id)}>삭제</button>
              </li>
            ))}
          </ul>
        )}
      </div>{" "}
      <div className="mt-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-2 cursor-pointer" onClick={() => setShowCompleted(!showCompleted)}>
          완료
        </h2>
        {showCompleted && (
          <ul className="list-disc list-inside">
            {completedTodos.map((todo) => (
              <li key={todo.todo_id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.is_done}
                  onChange={() => handleCheckboxChange(todo)}
                  className="mr-2"
                />
                <span className={todo.is_done ? "line-through" : ""}>{todo.todo_title}</span>
                <span>{dayjs(todo.event_datetime).format("YYYY-MM-DD")}</span>
                <button onClick={() => deleteTodo(todo.todo_id)}>삭제</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoList;
