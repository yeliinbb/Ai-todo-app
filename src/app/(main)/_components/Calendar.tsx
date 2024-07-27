"use client";

import { useTodos } from "@/utils/todoApi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import useselectedCalendarStore from "@/store/selectedCalendar.store";

const Calendar = ({ todos, pathname }: any) => {
  const { selectedDate, setSelectedDate } = useselectedCalendarStore();
  const { addTodo } = useTodos();

  const events = todos?.map((todo: any) => ({
    title: todo.todo_title || "",
    start: todo.event_datetime ? dayjs(todo.event_datetime).toISOString() : ""
  }));

  return (
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
      // dayCellClassNames={(date) => {
      //   const classes = ["text-center", "p-2", "hover:bg-gray-200"];
      //   if (date.date.toISOString().split("T")[0] === selectedDate) {
      //     classes.push("rounded-full");
      //   }
      //   return classes.join(" ");
      // }}
      dayCellContent={(cellInfo) => {
        const hasEvent = events?.some(
          (event: any) => dayjs(event.start).format("YYYY-MM-DD") === cellInfo.date.toISOString().split("T")[0]
        );
        return (
          <div className="relative">
            <div>{cellInfo.dayNumberText}</div>
            {hasEvent && <span className="absolute bottom-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>}
          </div>
        );
      }}
      dateClick={(info) => {
        if (pathname !== "/diary") {
          const title = prompt("투두를 입력하세요");
          if (title) {
            if (title && addTodo) {
              addTodo({
                user_id: "example-user",
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
          }
        } else {
          setSelectedDate(info.dateStr);
        }
      }}
    />
  );
};
export default Calendar;
