"use client";

import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";

const SearchTodoBtn = () => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-center mt-[75px] ml-4">
      <div className="md:w-8/12 min-w-[340px] flex justify-start">
        <IoIosSearch className="w-[24px] h-[24px]" onClick={() => router.push("/todo-list/search")} />
      </div>
    </div>
  );
};

export default SearchTodoBtn;
