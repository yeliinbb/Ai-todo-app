"use client";
import CloseBtn from "@/components/icons/modal/CloseBtn";
import ModalBtn from "@/components/modal/ModalBtn";
import React, { useCallback, useEffect, useState } from "react";
import ReactModal from "react-modal";

type ButtonConfig = {
  text: string;
  style: string;
};

type ModalConfig = {
  message: string;
  confirmButton: ButtonConfig;
  cancelButton?: ButtonConfig;
};

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig>({
    message: "",
    confirmButton: { text: "", style: "" },
    cancelButton: undefined
  });
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  const [shouldExecuteCallback, setShouldExecuteCallback] = useState(true);

  const openModal = useCallback((newConfig: ModalConfig, confirmCallback?: () => void) => {
    setConfig(newConfig);
    setIsModalOpen(true);
    setOnConfirm(() => confirmCallback || null);
    setShouldExecuteCallback(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    if (!shouldExecuteCallback) {
      setOnConfirm(null);
    }
    setShouldExecuteCallback(false);
  }, [setShouldExecuteCallback, shouldExecuteCallback]);

  const handleConfirm = useCallback(() => {
    if (onConfirm && shouldExecuteCallback) {
      onConfirm();
    }
    closeModal();
  }, [onConfirm, closeModal, shouldExecuteCallback]);

  const handleCancel = useCallback(() => {
    setShouldExecuteCallback(false);
    closeModal();
  }, [closeModal]);

  const getButtonStyle = (style: string) => {
    switch (style) {
      case "확인":
        return "bg-system-red200 text-system-white hover:border-2 hover:border-solid hover:border-system-red300 active:bg-system-red300 ";
      case "취소":
        return "bg-system-white border border-solid border-gray-400 text-system-black hover:border-2 hover:border-solid hover:border-gray-600 active:bg-gray-600 ";
      case "삭제":
        return "bg-system-red200 text-system-white hover:border-2 hover:border-solid hover:border-system-red300 active:bg-system-red300";
      case "시스템":
        return "bg-gradient-pai400-fai500-br text-system-white hover:border-2 hover:border-solid hover:border-gradient-pai600-fai700-br disabled:bg-gradient-gray300-gray200-br active:bg-gradient-pai600-fai700-br ";
      case "pai":
        return "bg-pai-400 text-system-white hover:border-2 hover:border-solid hover:border-pai-600 active:bg-pai-600";
      case "fai":
        return "bg-fai-500 text-system-white hover:border-2 hover:border-solid hover:border-fai-700 active:bg-fai-700";
      default:
        return style;
    }
  };

  const Modal = () => {
    return (
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        className="text-center bg-whiteTrans-wh72 w-[calc(100%-32px)] mobile:max-w-[21.438rem] mx-auto rounded-[32px] outline-none desktop:w-[calc(100%-104px)] desktop:h-[calc(100%-760px)] desktop:rounded-[56px] desktop:max-w-[580px] desktop:min-h-[264px] desktop:fixed desktop:top-1/2 desktop:left-[calc(50%+19.875rem)]"
        overlayClassName="fixed inset-0 bg-modalBg-black40 backdrop-blur-md z-[10000] flex items-center justify-center desktop:left-[max(21.75rem,min(calc(21.75rem+(100vw-1200px)*0.325),39.75rem))] desktop:block"
        style={{
          overlay: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          content: {
            position: "relative",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            margin: "0 auto"
          }
        }}
        ariaHideApp={false}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <div className="flex flex-col justify-center items-center w-full h-full mobile:px-5 mobile:py-6 desktop:px-10 desktop:py-11 relative">
          <div className="mb-5 w-full h-full flex flex-col items-center justify-center desktop:mb-10">
            <CloseBtn
              btnStyle={"absolute right-[15px] top-[15px] cursor-pointer desktop:top-[22px] desktop:right-[22px] "}
              onClick={handleCancel}
            />
            <div className="flex flex-col min-h-16 items-center justify-center desktop:gap-2">
              {config.message.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  <span className="flex items-center justify-center font-medium text-gray-900 text-base leading-[27px] desktop:text-bc2">
                    {line}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 w-full">
            {config.cancelButton && (
              <ModalBtn
                className={getButtonStyle(config.cancelButton.style)}
                onClick={handleCancel}
                text={config.cancelButton.text}
              />
            )}
            <ModalBtn
              className={getButtonStyle(config.confirmButton.style)}
              onClick={handleConfirm}
              text={config.confirmButton.text}
            />
          </div>
        </div>
      </ReactModal>
    );
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    Modal
  };
};

export default useModal;
