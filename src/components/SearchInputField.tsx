"use client";
import { ChangeEvent } from "react";

interface SearchInputFieldProps {
  inputValue: string;
  handleChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInputField = ({ inputValue, handleChangeSearch }: SearchInputFieldProps) => {
  return (
    <input
      type="text"
      value={inputValue}
      placeholder="검색어를 입력하세요."
      onChange={handleChangeSearch}
      className="bg-gray-100 rounded-full px-5 py-3 placeholder-gray-500 text-sm w-full focus:outline-grayTrans-60080"
    />
  );
};

export default SearchInputField;
