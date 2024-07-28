"use client";

import dayjs from "dayjs";
import { useCallback } from "react";
import DatePicker from "react-datepicker";
import "./datepicker.scss";
import { ko } from "date-fns/locale";
import CalendarDayContent from "./CalendarDayContent";

export interface CalendarProps {
  selected: Date;
  onChange: (selected: Date) => void;
  events?: CalendarEvent[];
  collapsed?: boolean; // 이번 주만 보이게 접기
}

export interface CalendarEvent {
  date: Date;
}

const Calendar = ({ selected, onChange, events, collapsed }: CalendarProps) => {
  const handleChange = useCallback((date: Date | null) => {
    if (date) {
      onChange(date);
    }
  }, []);

  const renderDayContents = useCallback(
    (day: number, date: Date) => {
      if (collapsed) {
        const isThisWeek = dayjs().isSame(dayjs(date), "week");
        if (!isThisWeek) {
          return null;
        }
      }
      return <CalendarDayContent date={date} day={day} events={events ?? []} />;
    },
    [events, collapsed]
  );
  return (
    <DatePicker
      inline
      selected={selected}
      onChange={(date) => handleChange(date)}
      renderDayContents={renderDayContents}
      locale={ko}
    />
  );
};
export default Calendar;
