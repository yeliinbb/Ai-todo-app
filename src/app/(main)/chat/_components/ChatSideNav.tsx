"use client";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import SessionsChat from "./SessionsChat";
import SearchSessions from "./SearchSessions";

interface ChatSideProps {
  isSideNavOpen: boolean;
}

const ChatSideNav = ({ isSideNavOpen }: ChatSideProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const pathName = usePathname();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (!isSideNavOpen) return null;
  return (
    <nav>
      <SearchSessions handleSearch={handleSearch} initialSearchQuery={searchQuery} />
      <SessionsChat aiType={pathName.includes("assistant") ? "assistant" : "friend"} searchQuery={searchQuery} />
    </nav>
  );
};

export default ChatSideNav;
