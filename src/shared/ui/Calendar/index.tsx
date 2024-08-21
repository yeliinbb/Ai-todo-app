"use client";

import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "./datepicker.scss";
import { ko } from "date-fns/locale";
import CalendarDayContent, { CalenderColors as CalendarColors } from "./CalendarDayContent";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MonthlyCalendarIcon from "@/components/icons/MonthlyCalendarIcon";
import WeeklyCalendarIcon from "@/components/icons/WeeklyCalendarIcon";

export interface CalendarProps {
  selectedDate: Date;
  onChange: (selected: Date) => void;
  events?: CalendarEvent[];
  initialCollapsed: boolean;
  color?: CalendarColors;
  className?: string;
}

export interface CalendarEvent {
  date: Date;
  done?: boolean;
}

const Calendar = ({ selectedDate, onChange, events, initialCollapsed, color, className }: CalendarProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed);
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());
  const today = useMemo(() => dayjs(), []);
  const selectedDayjs = useMemo(() => dayjs(selectedDate), [selectedDate]);

  useEffect(() => {
    const updateCollapseState = () => {
      if (window.innerWidth >= 1200) return setCollapsed(false);
      if (window.innerWidth < 1200) return setCollapsed(initialCollapsed);
    };
    updateCollapseState();

    window.addEventListener("resize", updateCollapseState);

    return () => window.removeEventListener("resize", updateCollapseState);
  }, [initialCollapsed]);

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
        color={color ?? "pai"}
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
    <div className={className}>
      <DatePicker
        inline
        onMonthChange={(month: Date) => setCurrentMonth(dayjs(month))}
        selected={selectedDate}
        onChange={(date) => handleChange(date)}
        renderDayContents={renderDayContents}
        locale={ko}
        renderCustomHeader={({ monthDate, increaseMonth, decreaseMonth, changeMonth, changeYear }) => (
          <div className="relative flex items-center mb-[0.5rem] desktop:p-[1rem]">
            <div className="w-[2.5rem] flex items-center justify-start">
              <button
                onClick={() => {
                  const willCollapsed = !collapsed;
                  if (willCollapsed) {
                    changeYear(dayjs(monthDate).year());
                    changeMonth(dayjs(monthDate).month());
                  }
                  setCollapsed(willCollapsed);
                }}
              >
                {collapsed ? <MonthlyCalendarIcon /> : <WeeklyCalendarIcon />}
              </button>
            </div>

            <div className="flex-1 flex justify-center items-center relative gap-4">
              {!collapsed && (
                <button onClick={decreaseMonth}>
                  <FaChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
              )}
              <div className="font-sans text-h6 font-extrabold text-gray-700 text-center desktop:text-h4">
                {dayjs(monthDate).format("YYYY년 M월")}
              </div>
              {!collapsed && (
                <button onClick={increaseMonth}>
                  <FaChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="w-[40px] flex items-center justify-end">
              {/* {!collapsed && ( */}
              <button
                className="font-sans text-bc6 font-medium flex-shrink-0 bg-gray-900 text-system-white rounded-full w-[2.875rem] h-[1.5rem]"
                onClick={() => {
                  changeYear(today.year());
                  changeMonth(today.month());
                  onChange(today.toDate());
                }}
              >
                오늘
              </button>
              {/* )} */}
            </div>
          </div>
        )}
        className="h-full"
      />
    </div>
  );
};
export default Calendar;
