"use client";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { IoMenu } from "react-icons/io5";
import SessionsChat from "./SessionsChat";
import SearchSessions from "./SearchSessions";

const ChatNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathName = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <nav>
      <button onClick={toggleMenu}>
        <IoMenu />
      </button>
      {isMenuOpen && (
        <>
          <SearchSessions handleSearch={handleSearch} initialSearchQuery={searchQuery} />
          <SessionsChat aiType={pathName.includes("assistant") ? "assistant" : "friend"} searchQuery={searchQuery} />
        </>
      )}
    </nav>
  );
};

export default ChatNav;
