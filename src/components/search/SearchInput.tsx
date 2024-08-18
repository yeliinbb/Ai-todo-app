"use client";
import { ChangeEvent, FormEvent } from "react";
import SearchButton from "./SearchButton";
import SearchInputField from "./SearchInputField";

interface SearchInputProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  inputValue: string;
  handleChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ handleSubmit, inputValue, handleChangeSearch }: SearchInputProps) => {
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 py-2 desktop:py-5 ">
      <SearchInputField inputValue={inputValue} handleChangeSearch={handleChangeSearch} />
      <SearchButton inputValue={inputValue} />
    </form>
  );
};

export default SearchInput;
