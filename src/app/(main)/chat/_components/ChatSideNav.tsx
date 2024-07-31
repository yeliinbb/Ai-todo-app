"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useState, useRef } from "react";
import SessionsChat from "./SessionsChat";
import SearchSessions from "./SearchSessions";

interface ChatSideProps {
  isSideNavOpen: boolean;
  handleClose: () => void;
}

const ChatSideNav = ({ isSideNavOpen, handleClose }: ChatSideProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const pathName = usePathname();
  const router = useRouter();
  const prevPathNameRef = useRef(pathName);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleItemClick = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router]
  );

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
        className={`fixed top-0 left-0 bottom-0 w-72 bg-system-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <SearchSessions handleSearch={handleSearch} initialSearchQuery={searchQuery} />
          <SessionsChat
            aiType={pathName.includes("assistant") ? "assistant" : "friend"}
            searchQuery={searchQuery}
            handleItemClick={handleItemClick}
          />
        </div>
      </nav>
    </>
  );
};

export default ChatSideNav;
