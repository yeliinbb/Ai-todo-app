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

  const openModal = useCallback((newConfig: ModalConfig, confirmCallback?: () => void) => {
    setConfig(newConfig);
    setIsModalOpen(true);
    setOnConfirm(() => confirmCallback || null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setOnConfirm(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    closeModal();
  }, [onConfirm, closeModal]);

  const handleCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const getButtonStyle = (style: string) => {
    switch (style) {
      case "확인":
        return "bg-system-red200 text-system-white hover:border-system-red300 active:bg-system-red300 ";
      case "취소":
        return "bg-system-white border border-solid border-gray-400 text-system-black hover:border-gray-600 active:bg-gray-600 ";
      case "삭제":
        return "bg-system-red200 text-system-white hover:border-system-red300 active:bg-system-red300";
      case "시스템":
        return "bg-gradient-pai400-fai500-br text-system-white hover:border-gradient-pai600-fai700-br active:bg-gradient-pai600-fai700-br";
      case "pai":
        return "bg-pai-400 text-system-white hover:border-pai-600 active:bg-pai-600";
      case "fai":
        return "bg-fai-500 text-system-white hover:border-fai-700 active:bg-fai-700";
      default:
        return style;
    }
  };

  const Modal = () => {
    return (
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        className="text-center bg-whiteTrans-wh72 mobile:w-[calc(100%-32px)] mx-auto rounded-[32px] p-6 desktop:w-[343px] outline-none"
        overlayClassName="fixed inset-0 bg-modalBg-black40 backdrop-blur-md z-[10000] flex items-center justify-center"
        ariaHideApp={false}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <div className="mb-5 relative">
          <CloseBtn btnStyle={"absolute right-0 top-[-6px] cursor-pointer"} onClick={handleCancel} />
          <div className="flex flex-col min-h-16 items-center justify-center">
            {config.message.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                <span className="flex items-center justify-center font-medium text-gray-900 text-base leading-[27px]">
                  {line}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2">
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
