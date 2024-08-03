"use client";
import useDebounce from "@/hooks/useDebounce";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import SearchInput from "@/components/SearchInput";
interface SearchSessionsProps {
  handleSearch: (query: string) => void;
  initialSearchQuery: string;
}

const SearchLists = ({ handleSearch, initialSearchQuery }: SearchSessionsProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const debounceSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    handleSearch(debounceSearchTerm);
  }, [debounceSearchTerm, initialSearchQuery, handleSearch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleSearch(searchTerm);
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <SearchInput handleSubmit={handleSubmit} inputValue={searchTerm} handleChangeSearch={handleChangeSearch} />
    </>
  );
};

export default SearchLists;
