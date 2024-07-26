import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

const PasswordHeader = () => {
  return (
    <div className="w-full flex justify-center mt-[75px] ml-4">
      <div className="md:w-8/12 min-w-[340px] flex justify-center">
        <div className="min-w-[340px] md:w-8/12 flex justify-center items-center relative">
          <Link href={"/my-page"}>
            <IoIosArrowBack className="w-[24px] h-[24px] absolute left-0 transform -translate-y-2 md:-translate-x-32 md:-left-1" />
          </Link>
          <h1 className="text-center text-xl w-[340px]">비밀번호 변경</h1>
        </div>
      </div>
    </div>
  );
};

export default PasswordHeader;
