import Image from "next/image";
import { useMediaQuery } from "react-responsive";

const ResponsiveBanner = () => {
  const isDesktop = useMediaQuery({ minWidth: 1200 });
  const altText = "PAi와 함께하는 나의 일상 기록";

  // 데스크톱에서의 왼쪽 고정 영역 너비 계산
  const leftColumnWidth = isDesktop ? `calc(21.75rem + (100vw - 1200px) * 0.325)` : "0px";

  return (
    <div className="w-full">
      <div
        className="w-full h-auto aspect-[375/160] desktop:aspect-[1284/320] relative"
        style={{
          width: isDesktop ? `calc(100vw - ${leftColumnWidth})` : "100%",
          maxWidth: isDesktop ? "calc(100vw - 21.75rem)" : "100%"
        }}
      >
        <Image
          src="/bannerHome1-Mobile.png"
          fill
          alt={altText}
          priority
          sizes="(max-width: 1199px) 100vw, 80vw"
          className="object-cover block desktop:hidden"
        />
        <Image
          src="/bannerHome1-PC.png"
          fill
          alt={altText}
          priority
          sizes="(min-width: 1200px) 80vw, 1px"
          className="object-cover hidden desktop:block"
        />
      </div>
    </div>
  );
};

export default ResponsiveBanner;
