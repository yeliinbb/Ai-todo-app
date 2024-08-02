"use client";

import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "./datepicker.scss";
import { ko } from "date-fns/locale";
import CalendarDayContent from "./CalendarDayContent";
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp } from "react-icons/fa";

export interface CalendarProps {
  selectedDate: Date;
  onChange: (selected: Date) => void;
  events?: CalendarEvent[];
  initialCollapsed: boolean;
}

export interface CalendarEvent {
  date: Date;
  done?: boolean;
}

const Calendar = ({ selectedDate, onChange, events, initialCollapsed }: CalendarProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed);
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());
  const today = useMemo(() => {
    return dayjs();
  }, []);
  const selectedDayjs = useMemo(() => dayjs(selectedDate), [selectedDate]);

  const renderDayContents = (day: number, _date: Date) => {
    const date = dayjs(_date);
    if (collapsed) {
      const isThisWeek = today.isSame(date, "week");
      if (!isThisWeek) {
        return null;
      }
    }
    return (
      <CalendarDayContent
        date={date}
        day={day}
        events={events ?? []}
        isToday={today.isSame(date, "date")}
        isCurrentMonth={currentMonth.isSame(date, "month")}
        isSelected={selectedDayjs.isSame(date, "date")}
      />
    );
  };

  const handleChange = useCallback(
    (date: Date | null) => {
      if (date) {
        onChange(date);
      }
    },
    [onChange]
  );

  return (
    <div>
      <DatePicker
        inline
        onMonthChange={(month: Date) => setCurrentMonth(dayjs(month))}
        selected={selectedDate}
        onChange={(date) => handleChange(date)}
        renderDayContents={renderDayContents}
        locale={ko}
        renderCustomHeader={({ monthDate, increaseMonth, decreaseMonth, changeMonth, changeYear }) => (
          <div className="flex items-center">
            <button
              className="block"
              onClick={() => {
                const willCollapsed = !collapsed;
                if (willCollapsed) {
                  changeYear(today.year());
                  changeMonth(today.month());
                }
                setCollapsed(willCollapsed);
              }}
            >
              {collapsed ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            <div className="flex-1 flex items-center gap-[12px] justify-center">
              {!collapsed && (
                <button onClick={() => decreaseMonth()}>
                  <FaChevronLeft />
                </button>
              )}
              <div className="font-semi-bold text-gray-700 text-lg">{dayjs(monthDate).format("YYYY년 M월")}</div>
              {!collapsed && (
                <button onClick={() => increaseMonth()}>
                  <FaChevronRight />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                changeYear(today.year());
                changeMonth(today.month());
              }}
            >
              오늘
            </button>
          </div>
        )}
      />
    </div>
  );
};
export default Calendar;
