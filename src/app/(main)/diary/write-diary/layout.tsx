
import React, { PropsWithChildren } from "react";
import DiaryWriteHeader from "../_components/DiaryWriteHeader";
import { DiaryProvider } from "../_components/DiaryProvider";

const DiaryWriteLayout = ({ children }: PropsWithChildren) => {
  return (
    <DiaryProvider>
      <div className="bg-gray-100 desktop:h-screen mobile:h-[100dvh] ">
        {children}
      </div>
    </DiaryProvider>
  );
};

export default DiaryWriteLayout;
