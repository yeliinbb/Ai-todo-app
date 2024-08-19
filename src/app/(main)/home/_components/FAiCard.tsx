"use client";

import NextBtn from "@/components/icons/authIcons/NextBtn";
import NextLargeBtn from "@/components/icons/authIcons/NextLargeBtn";
import useModal from "@/hooks/useModal";
import Image from "next/image";
import { useRouter } from "next/navigation";

type PropsType = {
  user: {
    created_at: string;
    email: string;
    isOAuth: boolean;
    nickname: string;
    user_id: string;
  } | null;
};

const FAiCard = ({ user }: PropsType) => {
  const router = useRouter();
  const { openModal, Modal } = useModal();
  const handleClickFAiChat = () => {
    //console.log(456);
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
  };

  return (
    <div className="desktop:w-[35.625rem] desktop:h-[20.75rem] desktop:rounded-[40px] min-w-[168px] min-h-[204px] w-full h-auto flex justify-center items-center rounded-[32px] border-2 border-fai-300 bg-fai-400">
      <Modal />
      <div className="desktop:w-[calc(100%-13px)] desktop:h-[19.75rem] desktop:rounded-[36px] desktop:border-4 min-w-[160px] min-h-[196px] w-[calc(100%-4px)] h-auto flex flex-col justify-center items-center rounded-[28px] border-2 border-fai-100 bg-fai-400">
        <div className="desktop:flex-row flex flex-col items-center">
          <Image
            src={"/homeFAi.png"}
            width={60}
            height={60}
            alt="PAi"
            priority
            sizes="(max-width: 1200px) 60px"
            className="block desktop:hidden"
          />
          <Image src={"/homeFAi.png"} width={160} height={160} alt="PAi" priority className="hidden desktop:block" />
          <div className="desktop:items-start desktop:ml-8 desktop:mt-5 flex flex-col items-center mt-[0.5rem] mb-4 ">
            <p className="desktop:w-[18.625rem] desktop:text-[1.625rem] desktop:leading-7 desktop:tracking-[0.8px] desktop:font-medium text-bc5 text-system-white">
              이야기를 듣고
            </p>
            <p className="desktop:w-[18.625rem] desktop:text-[1.625rem] desktop:leading-7 desktop:tracking-[0.8px] desktop:font-medium text-bc5 text-system-white">
              일기를 작성해드려요
            </p>
          </div>
        </div>
        <div
          onClick={handleClickFAiChat}
          className="desktop:w-[calc(100%-50px)] desktop:mt-9 min-w-[7.75rem] w-[calc(100%-32px)] relative flex rounded-full text-fai-500 bg-system-white hover:cursor-pointer"
        >
          <div className="desktop:px-5 desktop:py-3 min-w-[5.25rem] w-full h-auto flex mr-1 px-3 py-1">
            <Image
              src={"/fai.svg"}
              alt="FAi와 채팅"
              width={20}
              height={11.2}
              priority
              sizes="(max-width: 1200px) 20px"
              className="desktop:w-[2.5rem] desktop:h-[1.394rem]"
            />
            <p className="desktop:text-sh3 desktop:ml-1.5 ml-0.5 text-c1">와 채팅</p>
          </div>
          <div className="desktop:hidden block absolute top-1 right-1.5">
            <NextBtn />
          </div>
          <div className="desktop:block hidden absolute top-3.5 right-5">
            <NextLargeBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAiCard;
