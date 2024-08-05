"use client";

import BackBtn from "@/components/icons/authIcons/BackBtn";
import { useRouter } from "next/navigation";

// mt-[75px]

const AuthHeader = () => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-center mt-[15px]">
      <div className="md:w-8/12 min-w-[343px] flex justify-start " onClick={() => router.back()}>
        <BackBtn />
      </div>
    </div>
  );
};

export default AuthHeader;
