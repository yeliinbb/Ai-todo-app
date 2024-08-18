import SearchIcon from "../../assets/search.svg";

interface SearchButtonProps {
  inputValue: string;
}

const SearchButton = ({ inputValue }: SearchButtonProps) => {
  return (
    <button
      type="submit"
      className="bg-system-white rounded-full p-3 border border-gray-200 border-solid cursor-pointer"
      disabled={inputValue.length === 0}
    >
      <SearchIcon />
    </button>
  );
};

export default SearchButton;
