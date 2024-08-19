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
  onClick?: () => void;
}

const SearchListBox = ({ id, title, description, dateYear, aiType, isFai, onClick }: SearchListBoxProps) => {
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
      className={`group bg-system-white cursor-pointer mb-2 rounded-3xl px-5 py-4 flex flex-col justify-center gap-4 border border-solid hover:border hover:border-solid desktop:hover:border-2 desktop:border-2 desktop:p-6 desktop:mb-5 desktop:max-h-[140px] desktop:rounded-[40px] 
      ${
        isFai
          ? "border-fai-300 hover:border-fai-500 active:bg-fai-500"
          : "border-pai-200 hover:border-pai-400 active:bg-pai-400"
      }`}
      onClick={onClick ?? handleNavigateItem}
    >
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[70%] h-14 overflow-hidden ">
          <p
            className={`${isTodoListPage ? "h-14" : "h-7"} h-7 text-gray-900 text-h6 truncate desktop:text-h4 group-active:text-system-white`}
          >
            {title}
          </p>
          <p className="h-6 max-w-52 truncate text-bc5 text-gray-600 desktop:text-bc3 group-active:text-system-white">
            {description ?? null}
          </p>
        </div>
        <button
          className={`rounded-full bg-system-white backdrop-blur-xl min-w-9 h-9 flex justify-center items-center group-active:bg-system-white 
          ${
            isFai
              ? "border-fai-300 group-hover:border-fai-500 group-hover:border group-hover:border-solid desktop:group-hover:border-2"
              : "border-pai-200 group-hover:border-pai-400 group-hover:border group-hover:border-solid desktop:group-hover:border-2"
          } 
              group-active:bg-system-white group-active:border-system-white`}
        >
          <ArrowRight />
        </button>
      </div>
      <div
        className={`${isFai ? "bg-fai-300" : "bg-pai-300"} 
        px-3 rounded-full text-system-white text-bc6 w-fit flex items-center gap-1 self-end desktop:px-4 desktop:py-[2px]
        group-active:bg-transparent group-active:border group-active:border-system-white`}
      >
        <CalendarWhiteIcon />
        <p>{dateYear}</p>
      </div>
    </li>
  );
};

SearchListBox.displayName = "SearchListBox";

export default SearchListBox;
