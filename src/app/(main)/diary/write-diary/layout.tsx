import React, { PropsWithChildren } from "react";
import DiaryWriteHeader from "../_components/DiaryWriteHeader";

const DiaryWriteLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <DiaryWriteHeader headerText="일기 쓰기" />
      {children}
    </>
  );
};

export default DiaryWriteLayout;
