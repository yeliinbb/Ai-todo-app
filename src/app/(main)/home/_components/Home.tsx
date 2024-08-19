"use client";

import Image from "next/image";
import PAiCard from "./PAiCard";
import FAiCard from "./FAiCard";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useUserData } from "@/hooks/useUserData";
import AddFABtn from "@/shared/ui/AddFABtn";
import WriteDiaryBtn from "./WriteDiaryBtn";
import WriteTodoBtn from "./WriteTodoBtn";
import { useRouter } from "next/navigation";
import useModal from "@/hooks/useModal";
import TodoDrawer from "@/todos/components/TodoDrawer";

const Home = () => {
  const router = useRouter();
  const { openModal, Modal } = useModal();
  const { data } = useUserData();
  const user = data || null;
  const [isVisible, setIsVisible] = useState(false);
  const conditionalDefaultClass = isVisible ? "bg-gradient-pai600-fai700-br" : "bg-gradient-pai400-fai500-br";

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleClickBtn = (index: number) => {
    if (!user) {
      openModal(
        {
          message: "로그인 이후 사용가능한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
          confirmButton: { text: "확인", style: "시스템" }
        },
        () => router.push("/login")
      );
      return;
    }

    if (index === 0) {
      //console.log("다이어리버튼");
      router.push("/diary/write-diary");
      return;
    } else if (index === 1) {
      //console.log("투두버튼");
      // 투두 작성모달이 열린 상태의 투두페이지로 이동... 어떻게??
      return;
    }
  };

  const buttonList = [
    {
      Component: WriteDiaryBtn,
      onClick: (index: number) => handleClickBtn(index)
    },
    {
      Component: WriteTodoBtn,
      onClick: (index: number) => handleClickBtn(index)
    }
  ];

  useEffect(() => {
    const hasVisited = getCookie("visitedMainPage");
    if (!hasVisited) {
      setCookie("visitedMainPage", true, { maxAge: 60 * 60 * 24 * 30 });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center pt-[4.5rem]">
      <Modal />
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
        <PAiCard user={user} />
        <FAiCard user={user} />
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
      <div
        className={`transform duration-300 ease-out ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-0 opacity-0"
        } flex flex-col justify-start items-center fixed bottom-[76px] right-0 w-[60px] h-[188px] bg-grayTrans-90020 rounded-full m-4 pt-1.5 gap-2.5`}
      >
        {buttonList.map((button, index) => (
          <div key={index} onClick={() => button.onClick(index)} className="hover:cursor-pointer">
            <button.Component />
          </div>
        ))}
      </div>
      <AddFABtn
        onClick={handleToggle}
        defaultClass={conditionalDefaultClass}
        hoverClass="hover:bg-pai-400 hover:border-pai-600 hover:border-2"
        pressClass="active:bg-gradient-pai600-fai700-br"
      />
    </div>
  );
};

export default Home;
