"use client";
import { AIType } from "@/types/chat.session.type";
import useClickNavigateItem from "../hooks/useClickNavigateItem";
import { usePathname } from "next/navigation";

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

  const { handleNavigateItem } = useClickNavigateItem(url);

  return (
    <li className="truncate cursor-pointer" onClick={handleNavigateItem}>
      <p>{title}</p>
      <p>{description ?? null}</p>
      <p>{dateYear}</p>
    </li>
  );
};

export default SearchListBox;
