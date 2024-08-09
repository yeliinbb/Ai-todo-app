"use client";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useState, useRef, useEffect } from "react";
import SessionsChat from "../app/(main)/chat/_components/SessionsChat";
import SearchLists from "./SearchLists";
import TodoListForSearch from "@/todos/components/TodoListForSearch";
import useSideNavStore from "../store/useSideNavStore";
import AiModeToggleSegment from "@/app/(main)/chat/_components/AiModeToggleSegment";

const SideNavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFai, setIsFai] = useState(false);
  const pathName = usePathname();
  const prevPathNameRef = useRef(pathName);
  const { isSideNavOpen, handleClose } = useSideNavStore();
  const prevIsSideNavOpenRef = useRef(isSideNavOpen);

  const isTodoListPage = pathName.includes("todo-list");
  const isChatMainPage = pathName === "/chat";

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // 사이드바 상태 변경 감지 및 검색어 초기화
  useEffect(() => {
    if (prevIsSideNavOpenRef.current !== isSideNavOpen) {
      resetSearch();
      prevIsSideNavOpenRef.current = isSideNavOpen;
    }
  }, [isSideNavOpen, resetSearch]);

  // 페이지 변경 감지 및 검색어 초기화
  useEffect(() => {
    if (prevPathNameRef.current !== pathName) {
      handleClose();
      resetSearch();
      prevPathNameRef.current = pathName;
    }
  }, [pathName, handleClose, resetSearch]);

  const handleCloseAndResetSearch = useCallback(() => {
    handleClose();
    resetSearch();
  }, [handleClose, resetSearch]);

  const handleToggleAiMode = () => {
    setIsFai(!isFai);
  };

  return (
    <>
      {isSideNavOpen && (
        <div
          className="fixed inset-0 bg-modalBg-black40 backdrop-blur-sm bg-opacity-50 z-40"
          onClick={handleCloseAndResetSearch}
        ></div>
      )}
      <nav
        className={`fixed top-0 left-0 bottom-0 w-[80%] bg-system-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <SearchLists
            handleSearch={handleSearch}
            initialSearchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resetSearch={resetSearch}
            isSideNavOpen={isSideNavOpen}
          />
          {isChatMainPage && <AiModeToggleSegment isFai={isFai} handleToggleAiMode={handleToggleAiMode} />}
          {isTodoListPage ? (
            <TodoListForSearch searchQuery={searchQuery} />
          ) : (
            <>
              {isChatMainPage ? (
                <SessionsChat aiType={isFai ? "friend" : "assistant"} searchQuery={searchQuery} isFai={isFai} />
              ) : (
                <SessionsChat
                  aiType={pathName.includes("assistant") ? "assistant" : "friend"}
                  searchQuery={searchQuery}
                  isFai={isFai}
                />
              )}
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default SideNavBar;
