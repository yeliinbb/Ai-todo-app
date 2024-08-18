import { ToastContainer, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomToastContainer = ({
  closeOnClick = true,
  position = "top-right",
  autoClose = 1500,
  hideProgressBar = true,
  limit = 1,
  ...props
}: ToastContainerProps) => {
  return (
    <ToastContainer
      closeOnClick={closeOnClick}
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      limit={limit}
      style={{ zIndex: 9999 }}
      {...props}
    />
  );
};

export default CustomToastContainer;
