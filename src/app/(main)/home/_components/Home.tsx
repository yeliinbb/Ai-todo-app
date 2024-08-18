import Image from "next/image";
import PAiCard from "./PAiCard";
import FAiCard from "./FAiCard";

const Home = () => {
  return (
    <div className="w-full h-full flex flex-col items-center pt-[4.5rem]">
      <Image
        src={"/bannerHome-Mobile.png"}
        width={375}
        height={160}
        alt="PAi와 함께하는 나의 일상 기록"
        priority
        sizes="(max-width: 1200px) 100vw, 375px"
        className="block desktop:hidden w-full h-auto"
      />
      <Image
        src={"/bannerHome-PC.png"}
        width={1284}
        height={320}
        alt="PAi와 함께하는 나의 일상 기록"
        priority
        sizes="(max-width: 1220px) 100vw, 1400px"
        className="hidden desktop:block"
      />
      <h1 className="desktop:text-sh1 desktop:my-10 my-5 text-center text-sh4 text-transparent bg-clip-text bg-gradient-pai400-fai500-br">
        오늘은 어떤 기록을 함께 할까요?
      </h1>
      <div className="desktop:gap-[2.5rem] flex justify-center gap-[0.563rem] w-[calc(100%-32px)]">
        <PAiCard />
        <FAiCard />
      </div>
      <Image
        src={"/bannerHome2-Mobile.png"}
        width={343}
        height={106}
        alt="홈에서도 가능한 투두와 다이어리 작성!"
        priority
        sizes="(max-width: 1200px) 100vw, 343px"
        className="desktop:hidden block mt-5 mb-[9.75rem] w-[calc(100%-32px)] h-auto"
      />
      <Image
        src={"/bannerHome2-PC.png"}
        width={1180}
        height={160}
        alt="홈에서도 가능한 투두와 다이어리 작성!"
        priority
        sizes="(max-width: 1220px) 100vw, 1400px"
        className="desktop:mb-[10.5rem] hidden mt-12 desktop:block mb-[9.75rem]"
      />
      {/* fab버튼 추가 */}
    </div>
  );
};

export default Home;
