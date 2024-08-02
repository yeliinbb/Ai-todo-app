"use client";

import BackBtn from "@/components/icons/authIcons/BackBtn";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const AuthHeader = () => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-center mt-[75px] ">
      <div className="md:w-8/12 min-w-[343px] w-8/12 flex justify-start " onClick={() => router.back()}>
        <BackBtn />
      </div>
    </div>
  );
};

export default AuthHeader;
