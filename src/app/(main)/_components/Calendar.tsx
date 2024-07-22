"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar: React.FC = () => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth"
      }}
      weekends={true}
      firstDay={0} // 기본값, 일요일을 주의 시작일로 설정
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      events={[
        { title: "투두1", start: "2024-07-20", end: "2024-07-22" },
        { title: "투두2", start: "2024-07-25", allDay: true }
      ]}
      select={(info) => {
        alert("선택한 날짜: " + info.startStr + " to " + info.endStr);
      }}
      eventClick={(info) => {
        alert("투두:" + info.event.title);
      }}
    />
  );
};

export default Calendar;
