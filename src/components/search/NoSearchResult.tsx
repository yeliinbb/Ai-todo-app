import Image from "next/image";

const NoSearchResult = ({ isPai }: { isPai: boolean }) => {
  const imgSrc = isPai ? "/chat/paiSearch.svg" : "/chat/faiSearch.svg";
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[170px] h-[170px] desktop:h-[220px] desktop:w-[220px]">
        <Image
          src={imgSrc}
          alt="no search img"
          fill
          sizes="(min-width : 1200px) 220px, 170px"
          className="object-contain"
        />
      </div>
      <p className="text-sh4 mb-1 mt-2 desktop:text-sh1 desktop:mb-2 desktop:mt-5">검색된 결과가 없습니다</p>
      <p className="text-bc5 desktop:text-bc2">다른 키워드로 검색해보세요</p>
    </div>
  );
};

export default NoSearchResult;
