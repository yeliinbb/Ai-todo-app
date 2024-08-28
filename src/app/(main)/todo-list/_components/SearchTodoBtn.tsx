"use client";

import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";

const SearchTodoBtn = () => {
  const router = useRouter();
  return (
    <div>
      <IoIosSearch className="w-[24px] h-[24px]" onClick={() => router.push("/todo-list/search")} />
    </div>
  );
};

export default SearchTodoBtn;
