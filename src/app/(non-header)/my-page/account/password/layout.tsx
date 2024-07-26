import { PropsWithChildren } from "react";
import PasswordHeader from "../../_components/PasswordHeader";

const EditPasswordLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <PasswordHeader />
      {children}
    </>
  );
};

export default EditPasswordLayout;
