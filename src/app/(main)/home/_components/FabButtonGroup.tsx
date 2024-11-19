"use client";
import { cn } from "@/lib/utils/customClassName";
import { ButtonItem } from "./Home";
import usePWACheck from "@/hooks/usePWACheck";

interface FabButtonGroupProps {
  isVisible: boolean;
  buttonList: ButtonItem[];
}

const FabButtonGroup = ({ isVisible, buttonList }: FabButtonGroupProps) => {
  const { isPWA } = usePWACheck();
  const positionClass = cn("absolute right-0 m-4", {
    "bottom-28": isPWA,
    "bottom-16 desktop:bottom-20": !isPWA
  });

  return (
    <div
      style={{ transform: "translate3d(0,0,0)" }}
      className={cn(
        "transform duration-300 ease-out flex flex-col justify-start items-center",
        "w-[60px] bg-grayTrans-90020 rounded-full pt-1.5 gap-2.5 h-[188px]",
        isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-0 opacity-0",
        positionClass
      )}
    >
      {buttonList.map((button, index) => (
        <div key={index} onClick={() => button.onClick(index)} className="hover:cursor-pointer">
          <button.Component />
        </div>
      ))}
    </div>
  );
};

export default FabButtonGroup;
