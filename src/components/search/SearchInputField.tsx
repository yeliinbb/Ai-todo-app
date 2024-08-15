"use client";
import usePageCheck from "@/hooks/usePageCheck";
import { ChangeEvent } from "react";

interface SearchInputFieldProps {
  inputValue: string;
  handleChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInputField = ({ inputValue, handleChangeSearch }: SearchInputFieldProps) => {
  const { isTodoPage, isChatPage } = usePageCheck();

  const getPlaceholderText = () => {
    if (isTodoPage) return "지난 투두리스트를 검색해보세요";
    if (isChatPage) return "지난 대화를 검색해보세요";
  };
  return (
    <input
      type="text"
      value={inputValue}
      placeholder={getPlaceholderText()}
      onChange={handleChangeSearch}
      className="bg-gray-100 rounded-full px-5 py-3 placeholder-gray-500 text-sm w-full focus:outline-grayTrans-60080"
    />
  );
};

export default SearchInputField;
