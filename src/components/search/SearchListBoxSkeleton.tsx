const SearchListBoxSkeleton = () => {
  return (
    <ul className="h-full animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => {
        return (
          <li
            key={index}
            className={`border-gray-200 mb-2 rounded-3xl px-5 py-4 flex flex-col justify-center gap-4 border border-solid`}
          >
            <div className="flex w-full justify-between">
              <div className="flex flex-col w-[70%] h-14 gap-2">
                <p className={`h-7 w-40 bg-gray-200 rounded-full`}></p>
                <p className="h-6 w-40 bg-gray-200 rounded-full"></p>
              </div>
            </div>
            <div className={`px-3 rounded-full w-32 h-6 flex items-center gap-1 self-end bg-gray-200`}></div>
          </li>
        );
      })}
    </ul>
  );
};

export default SearchListBoxSkeleton;
