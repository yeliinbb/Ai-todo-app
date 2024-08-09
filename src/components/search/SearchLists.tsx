"use client";
import useDebounce from "@/hooks/useDebounce";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import SearchInput from "@/components/search/SearchInput";
interface SearchSessionsProps {
  handleSearch: (query: string) => void;
  initialSearchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  resetSearch: () => void;
  isSideNavOpen: boolean;
}

const SearchLists = ({
  handleSearch,
  initialSearchQuery,
  setSearchQuery,
  resetSearch,
  isSideNavOpen
}: SearchSessionsProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  useEffect(() => {
    if (debouncedSearchTerm !== initialSearchQuery) {
      handleSearch(debouncedSearchTerm);
      setSearchQuery(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, handleSearch, setSearchQuery, initialSearchQuery]);

  useEffect(() => {
    setSearchTerm(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    if (!isSideNavOpen) {
      resetSearch();
      setSearchTerm("");
    }
  }, [isSideNavOpen, setSearchQuery, setSearchTerm, resetSearch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchTerm);
    setSearchQuery(searchTerm);
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
  };

  return (
    <>
      <SearchInput handleSubmit={handleSubmit} inputValue={searchTerm} handleChangeSearch={handleChangeSearch} />
    </>
  );
};

export default SearchLists;
