import React, { PropsWithChildren } from "react";
import DiaryWriteHeader from "../_components/DiaryWriteHeader";

const DiaryWriteLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <DiaryWriteHeader />
      {children}
    </>
  );
};

export default DiaryWriteLayout;
