"use client";
import React from "react";
import { AIType } from "@/types/chat.session.type";
import useClickNavigateItem from "../../hooks/useClickNavigateItem";
import { usePathname } from "next/navigation";
import ArrowRight from "../../assets/chevron.right.svg";
import CalendarWhiteIcon from "../../assets/calendar.white.svg";

interface SearchListBoxProps {
  id: string;
  title?: string;
  description?: string;
  dateYear?: string;
  aiType?: AIType;
  isFai?: boolean;
}

const SearchListBox = React.memo(({ id, title, description, dateYear, aiType, isFai }: SearchListBoxProps) => {
  const pathName = usePathname();
  let url = "";

  if (aiType) {
    if (pathName.includes("chat")) {
      url = `/chat/${aiType}/${id}`;
    }
  } else {
    if (pathName.includes("todo-detail")) {
      url = `/todo-list/todo-detail/${id}`;
    }
  }

  const isTodoListPage = pathName.includes("todo-list");

  const { handleNavigateItem } = useClickNavigateItem(url);

  return (
    <li
      className={`bg-system-white cursor-pointer mb-2 rounded-3xl px-5 py-4 flex flex-col justify-center gap-4 border border-solid ${isFai ? "border-fai-300 hover:border-fai-500 active:bg-fai-500 hover:border hover:border-solid" : "border-pai-200 hover:border-pai-400 active:bg-pai-400"}`}
      onClick={handleNavigateItem}
    >
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[70%] h-14 overflow-hidden ">
          <p
            className={`${isTodoListPage ? "h-14" : "h-7"} h-7 font-medium text-base leading-7 tracking-wide truncate`}
          >
            {title}
          </p>
          <p className="h-6 max-w-52 truncate">{description ?? null}</p>
        </div>
        <button
          className={`rounded-full bg-system-white backdrop-blur-xl min-w-9 h-9 flex justify-center items-center active:bg-system-white ${isFai ? "border-fai-300 hover:border-fai-500 hover:border hover:border-solid" : "border-pai-200 hover:border-pai-400 "} `}
        >
          <ArrowRight />
        </button>
      </div>
      <div
        className={`${isFai ? "bg-fai-300 active:border-system-white active:bg-none" : "bg-pai-300"} px-3 rounded-full text-system-white text-xs leading-6 tracking-wider w-fit flex items-center gap-1 self-end`}
      >
        <CalendarWhiteIcon />
        <p>{dateYear}</p>
      </div>
    </li>
  );
});

SearchListBox.displayName = "SearchListBox";

export default SearchListBox;
