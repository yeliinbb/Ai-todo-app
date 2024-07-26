import { PropsWithChildren } from "react";
import DeleteAccountHeader from "../../_components/DeleteAccountHeader";

const DeleteAccountLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <DeleteAccountHeader />
      {children}
    </>
  );
};

export default DeleteAccountLayout;
