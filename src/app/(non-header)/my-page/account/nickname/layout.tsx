import { PropsWithChildren } from "react";
import NicknameHeader from "../../_components/NicknameHeader";

const EditNicknameLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <NicknameHeader />
      {children}
    </>
  );
};

export default EditNicknameLayout;
