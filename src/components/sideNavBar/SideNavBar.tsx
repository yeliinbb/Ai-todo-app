"use client";
import { usePathname } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import TodoListForSearch from "@/todos/components/TodoListForSearch";
import AiModeToggleSegment from "@/app/(main)/chat/_components/AiModeToggleSegment";
import useSideNavStore from "@/store/useSideNavStore";
import SessionsChat from "@/app/(main)/chat/_components/SessionsChat";
import SearchLists from "../search/SearchLists";
import { useUserData } from "@/hooks/useUserData";

const SideNavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFai, setIsFai] = useState(false);
  const pathName = usePathname();
  const prevPathNameRef = useRef(pathName);
  const { isSideNavOpen, handleClose } = useSideNavStore();
  const prevIsSideNavOpenRef = useRef(isSideNavOpen);
  const { data: { user_id: userId } = {} } = useUserData();
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
        className={`fixed top-0 left-0 desktop:left-[max(21.75rem,min(calc(21.75rem+(100vw-1200px)*0.325),39.75rem))] bottom-0 mobile:w-[340px] desktop:w-[632px] bg-system-white desktop:bg-gradient-gray-white-lr shadow-lg z-50 transform transition-transform duration-300 ease-in-out rounded-e-[48px] ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full">
          <div className="mobile:px-4 desktop:pr-5 desktop:pl-[52px] shadow-sm">
            <SearchLists
              handleSearch={handleSearch}
              initialSearchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              resetSearch={resetSearch}
              isSideNavOpen={isSideNavOpen}
            />
            {isChatMainPage && (
              <div className="py-3">
                <AiModeToggleSegment isFai={isFai} handleToggleAiMode={handleToggleAiMode} />
              </div>
            )}
          </div>
          {isSideNavOpen && userId && (
            <>
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
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default SideNavBar;
