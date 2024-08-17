import React, { PropsWithChildren } from "react";
import DiaryWriteHeader from "../_components/DiaryWriteHeader";

const DiaryWriteLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gray-100 relative top-[-4.5rem] h-[calc(100vh-4.5rem)]">
      <DiaryWriteHeader headerText="일기 쓰기" />
      {children}
    </div>
  );
};

export default DiaryWriteLayout;
