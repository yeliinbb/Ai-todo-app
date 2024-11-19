"use client";
import AddContentBtn from "@/components/icons/AddContentBtn";
import { Button, ButtonProps } from "@/components/button";
import { cn } from "@/lib/utils/customClassName";
import { useEffect, useState } from "react";
import usePWACheck from "@/hooks/usePWACheck";

interface AddFABtnProps extends ButtonProps {
  onClick: () => void;
  defaultClass: string;
  hoverClass: string;
  pressClass: string;
}

const AddFABtn = ({ onClick, className, defaultClass, hoverClass, pressClass, ...rest }: AddFABtnProps) => {
  const { isMobilePWA } = usePWACheck();

  const bottomPosition = cn("absolute right-0 w-[60px] h-[60px]", {
    "bottom-28": isMobilePWA,
    "bottom-16 desktop:bottom-20": !isMobilePWA
  });

  return (
    <div className={cn("flex justify-center items-center bg-grayTrans-90020 rounded-full m-4", bottomPosition)}>
      <Button
        className={cn("w-[52px] h-[52px] rounded-full transition-all", defaultClass, hoverClass, pressClass, className)}
        onClick={onClick}
        {...rest}
      >
        <AddContentBtn className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </Button>
    </div>
  );
};

export default AddFABtn;
