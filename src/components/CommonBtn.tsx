import { ReactNode } from "react";

interface CommonBtnProps {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

const CommonBtn = ({ icon, onClick, className = "" }: CommonBtnProps) => {
  return (
    <button
      className={`rounded-full bg-whiteTrans-wh56 backdrop-blur-xl border-grayTrans-20032 border-solid border-1 w-14 h-14 flex justify-center items-center ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default CommonBtn;
