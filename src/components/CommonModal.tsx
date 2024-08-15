import useModalStore from "@/store/useConfirmModal.store";
import React from "react";
import ReactModal from "react-modal";
import CloseBtn from "./icons/modal/CloseBtn";

const CommonModal: React.FC = () => {
  const { isOpen, message, buttonName, closeModal, setConfirmed } = useModalStore();

  const handleConfirm = () => {
    setConfirmed(true);
    closeModal();
  };

  const handleCancel = () => {
    setConfirmed(false);
    closeModal();
  };

  const getButtonName = (buttonName: string) => {
    switch (buttonName) {
      case "삭제":
        return "bg-system-red200";
      case "재발송":
        return "bg-gradient-pai400-fai500-br";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleCancel}
      className="fixed  bg-modalBg-black40 w-full h-full z-50 flex items-center justify-center"
      overlayClassName="fixed inset-0 backdrop-blur-md"
      ariaHideApp={false}
    >
      <div className="text-center bg-whiteTrans-wh72 mobile:w-[calc(100%-32px)] mx-auto rounded-[32px] px-5 py-5 desktop:w-[343px]">
        <p className="mb-5  relative">
          <CloseBtn btnStyle={"absolute right-0 top-0 cursor-pointer"} onClick={handleCancel} />
          {message.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              <span className="leading-[30px] block font-medium text-gray-900 text-base">{line}</span>
            </React.Fragment>
          ))}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            className={`${getButtonName(buttonName)}  text-system-white py-2 rounded-full w-full hover:bg-red-700 transition text-sm font-extrabold cursor-pointer`}
          >
            {buttonName}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default CommonModal;
