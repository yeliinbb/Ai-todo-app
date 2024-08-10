import { ReactNode } from "react";

interface CommonBtnProps {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

const CommonBtn = ({ icon, onClick, className = "" }: CommonBtnProps) => {
  return (
    <button
      className={`rounded-full bg-whiteTrans-wh56 backdrop-blur-2xl shadow-inner border-grayTrans-20032 border-solid border-2 w-14 h-14 min-w-14 min-h-14 flex justify-center items-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default CommonBtn;
