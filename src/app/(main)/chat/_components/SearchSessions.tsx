"use client";
import useDebounce from "@/hooks/useDebounce";
import { FormEvent, useEffect, useState } from "react";

interface SearchSessionsProps {
  handleSearch: (query: string) => void;
  initialSearchQuery: string;
}

const SearchSessions = ({ handleSearch, initialSearchQuery }: SearchSessionsProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const debounceSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    handleSearch(debounceSearchTerm);
  }, [debounceSearchTerm, initialSearchQuery, handleSearch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleSearch(searchTerm);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={searchTerm} placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchSessions;
