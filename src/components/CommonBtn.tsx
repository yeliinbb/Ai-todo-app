import { ReactNode } from "react";

interface CommonBtnProps {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

const CommonBtn = ({ icon, onClick, className = "" }: CommonBtnProps) => {
  return (
    <button
      className={`rounded-full bg-system-white border-gray-200 border-solid border w-[46px] h-[46px] min-w-[46px] min-h-[46px] desktop:w-[56px] desktop:h-[56px] desktop:min-w-[56px] desktop:min-h-[56px] flex justify-center items-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default CommonBtn;
