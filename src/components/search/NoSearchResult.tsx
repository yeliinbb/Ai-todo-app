import PaiSearch from "../../assets/pai.search.svg";

const NoSearchResult = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <PaiSearch />
      <p className="text-sh4 mb-1 mt-2">검색된 결과가 없습니다</p>
      <p className="text-bc5">다른 키워드로 검색해보세요</p>
    </div>
  );
};

export default NoSearchResult;
