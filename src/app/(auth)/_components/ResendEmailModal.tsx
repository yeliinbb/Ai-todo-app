import { useThrottle } from "@/hooks/useThrottle";
import { SetStateAction, useCallback } from "react";
import SubmitBtn from "./SubmitBtn";
import { toast } from "react-toastify";
import CancelBtn from "@/components/icons/authIcons/CancelBtn";

type PropsType = {
  email: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: SetStateAction<boolean>) => void;
};

const handleModalClick = (e: React.MouseEvent) => {
  e.stopPropagation();
};

const ResendEmailModal = ({ email, isModalOpen, setIsModalOpen }: PropsType) => {
  const throttle = useThrottle();
  const handleResendBtn = useCallback(() => {
    throttle(async () => {
      try {
        const response = await fetch(`/api/auth/findPassword`, {
          method: "POST",
          body: JSON.stringify({ email })
        });
        if (response.ok) {
          toast.success("메일함을 확인해주세요.");
        } else {
          toast.warn("1분 이후 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("오류가 발생했습니다. 다시 시도해주세요.");
      }
    }, 1000);
  }, [email, throttle]);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="fixed inset-0 flex items-center justify-center bg-modalBg-black40 backdrop-blur-3xl z-20 "
      >
        <div onClick={handleModalClick} className="relative min-w-[343px] min-h-[163px] bg-system-white rounded-[32px]">
          <div className="flex flex-col justify-center items-center">
            <div onClick={() => setIsModalOpen(!isModalOpen)}>
              <CancelBtn />
            </div>
            <h2 className="absolute top-11 font-medium text-base text-gray-900">
              비밀번호 재설정 메일을 재발송할까요?
            </h2>
            <div onClick={handleResendBtn} className="mt-10">
              <SubmitBtn type={"button"} text={"재발송"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResendEmailModal;
