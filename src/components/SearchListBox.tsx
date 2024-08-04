"use client";
import { AIType } from "@/types/chat.session.type";
import useClickNavigateItem from "../hooks/useClickNavigateItem";
import { usePathname } from "next/navigation";
import ArrowRight from "../assets/chevron.right.svg";
import CalendarWhiteIcon from "../assets/calendar.white.svg";

interface SearchListBoxProps {
  id: string;
  title?: string;
  description?: string;
  dateYear?: string;
  aiType?: AIType;
}

const SearchListBox = ({ id, title, description, dateYear, aiType }: SearchListBoxProps) => {
  const pathName = usePathname();
  let url = "";
  if (aiType) {
    if (pathName.includes(aiType)) {
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
      className="bg-[#f4f4f4f3] cursor-pointer mb-2 rounded-3xl px-5 py-4 flex flex-col justify-center gap-4"
      onClick={handleNavigateItem}
    >
      <div className="flex ">
        <div className="flex flex-col w-56 h-14 overflow-hidden">
          <p
            className={`${isTodoListPage ? "h-14" : "h-7"} h-7 max-w-52 font-medium text-base leading-7 tracking-wide truncate`}
          >
            {title}
          </p>
          <p className="h-6 max-w-52 truncate">{description ?? null}</p>
        </div>
        <button className="rounded-full bg-system-white backdrop-blur-xl border-grayTrans-20032 border-solid border-1 w-9 h-9 flex justify-center items-center ">
          <ArrowRight />
        </button>
      </div>
      <div className="bg-pai-300 px-3 py-1 rounded-full text-system-white text-xs leading-6 w-fit flex items-center gap-1 self-end">
        <CalendarWhiteIcon />
        <p>{dateYear}</p>
      </div>
    </li>
  );
};

export default SearchListBox;
