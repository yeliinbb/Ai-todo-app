"use client";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useState, useRef } from "react";
import SessionsChat from "../app/(main)/chat/_components/SessionsChat";
import SearchLists from "./SearchLists";
import TodoListForSearch from "@/todos/components/TodoListForSearch";
import useSideNavStore from "../store/useSideNavStore";

const SideNavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const pathName = usePathname();
  const prevPathNameRef = useRef(pathName);
  const { isSideNavOpen, handleClose } = useSideNavStore();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const isTodoListPage = pathName.includes("todo-list");

  useLayoutEffect(() => {
    if (prevPathNameRef.current !== pathName) {
      handleClose();
      prevPathNameRef.current = pathName;
    }
  }, [pathName, handleClose]);

  return (
    <>
      {isSideNavOpen && <div className="fixed inset-0 bg-system-black bg-opacity-50 z-40" onClick={handleClose}></div>}
      <nav
        className={`fixed top-0 left-0 bottom-0 w-80 bg-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <SearchLists handleSearch={handleSearch} initialSearchQuery={searchQuery} />
          {isTodoListPage ? (
            <TodoListForSearch searchQuery={searchQuery} />
          ) : (
            <SessionsChat aiType={pathName.includes("assistant") ? "assistant" : "friend"} searchQuery={searchQuery} />
          )}
        </div>
      </nav>
    </>
  );
};

export default SideNavBar;
