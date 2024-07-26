"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const AuthHeader = () => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-center mt-[75px] ml-4">
      <div className="md:w-8/12 min-w-[340px] flex justify-start">
        <IoIosArrowBack className="w-[24px] h-[24px]" onClick={() => router.back()} />
      </div>
    </div>
  );
};

export default AuthHeader;
