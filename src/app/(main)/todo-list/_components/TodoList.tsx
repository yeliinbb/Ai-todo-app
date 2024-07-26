import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { Todo } from "@/types/todo.type";
import useselectedCalendarStore from "@/store/selectedCalendar.store";

interface TodoListProps {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "todo_id">) => void;
  // handleDateSelect: (date: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, addTodo }) => {
  const { selectedDate, setSelectedDate } = useselectedCalendarStore();

  const events = todos.map((todo) => {
    const event = {
      title: todo.todo_title || "",
      start: todo.event_datetime ? dayjs(todo.event_datetime).toISOString() : ""
    };
    console.log(event);
    return event;
  });

  return (
    // <FullCalendar
    //   plugins={[dayGridPlugin, interactionPlugin]}
    //   initialView="dayGridMonth"
    //   headerToolbar={{
    //     left: "prev,next today",
    //     center: "title",
    //     right: "dayGridMonth,dayGridWeek"
    //   }}
    //   contentHeight="auto"
    //   events={events}
    //   eventContent={(eventInfo) => (
    //     <div className="relative">
    //       <span className="absolute bottom-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
    //       {eventInfo.event.title}
    //     </div>
    //   )}
    //   dayCellClassNames={(date) => {
    //     const classes = ["text-center", "p-2"];
    //     if (date.date.toISOString().split("T")[0] === selectedDate) {
    //       classes.push("bg-purple-500", "text-white", "rounded-full");
    //     }
    //     return classes.join(" ");
    //   }}
    //   // select={(info) => {
    //   //   handleDateSelect(info.startStr);
    //   // }}
    //   dateClick={(info) => {
    //     const title = prompt("투두를 입력하세요");
    //     if (title) {
    //       addTodo({
    //         user_id: "임시 유저",
    //         todo_title: title,
    //         todo_description: "",
    //         event_datetime: new Date(info.dateStr).toISOString(),
    //         address: {
    //           lat: 0,
    //           lng: 0
    //         },
    //         is_done: false,
    //         created_at: new Date().toISOString()
    //       });
    //     }
    //   }}
    // />
    <div className="flex flex-col items-center">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek"
        }}
        contentHeight="auto"
        events={events}
        dayCellClassNames={(date) => {
          const classes = ["text-center", "p-2", "hover:bg-gray-200"];
          if (date.date.toISOString().split("T")[0] === selectedDate) {
            classes.push("rounded-full");
          }
          return classes.join(" ");
        }}
        dayCellContent={(cellInfo) => {
          const hasEvent = events.some((event) => event.date === cellInfo.date.toISOString().split("T")[0]);
          return (
            <div className="relative">
              <div>{cellInfo.dayNumberText}</div>
              {hasEvent && <span className="absolute bottom-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>}
            </div>
          );
        }}
        eventContent={(eventInfo) => (
          <div className="relative">
            {eventInfo.event.title && (
              <span className="absolute bottom-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            )}
          </div>
        )}
      />
      <div className="mt-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-2">오늘</h2>
        <ul className="list-disc list-inside">
          {events.map((event) => (
            <li key={event.id} className="flex items-center">
              <input
                type="checkbox"
                checked={event.isDone}
                // onChange={() => }
                className="mr-2"
              />
              <span className={event.isDone ? "line-through" : ""}>{event.title}</span>
              <span>{event.date}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-2">완료</h2>
        <ul className="list-disc list-inside">
          {/* {events.map((event) => (
            <li key={event.id} className="flex items-center">
              <input
                type="checkbox"
                checked={event.isDone}
                // onChange={() => }
                className="mr-2"
              />
              <span className={event.isDone ? "line-through" : ""}>{event.title}</span>
              <span>{event.date}</span>
            </li>
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
