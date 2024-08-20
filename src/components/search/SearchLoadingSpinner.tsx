import Image from "next/image";

const SearchLoadingSpinner = () => {
  return (
    <div className="w-6 h-6 desktop:w-9 desktop:h-9 flex items-center justify-center">
      <Image
        alt="로딩 중"
        src="/search.loading.spinner.gif"
        width={24}
        height={24}
        priority
        style={{ objectFit: "contain" }}
        sizes="(max-width: 1199px) 24px, 36px"
        className="w-6 h-6 desktop:w-9 desktop:h-9"
      />
    </div>
  );
};

export default SearchLoadingSpinner;
