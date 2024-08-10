import { Drawer, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/shared/ui/drawer";
import AddTodoForm, { TodoFormData } from "./AddTodoForm";
import dayjs from "dayjs";
import { useState } from "react";
import AddFABtn from "./AddFABtn";
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import useModal from "@/hooks/useModal";

interface AddTodoDrawerProps {
  onSubmit?: (data: TodoFormData) => Promise<void>;
  selectedDate: Date;
}

const AddTodoDrawer = ({ onSubmit, selectedDate }: AddTodoDrawerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data } = useUserData();
  const userId = data?.user_id;
  const router = useRouter();
  const { openModal, Modal } = useModal();

  const handleCheckLogin = () => {
    openModal(
      {
        message: "로그인 이후 사용가능한 서비스입니다. \n로그인페이지로 이동합니다.",
        confirmButton: { text: "확인", style: "시스템" }
      },
      () => router.push("/login")
    );
  };

  const openDrawer = () => {
    setOpen(true);
  };

  const toggleDrawerWithAuthCheck = () => {
    if (!userId) {
      handleCheckLogin();
    } else {
      openDrawer();
    }
  };

  const handleSubmit = async (data: TodoFormData) => {
    await onSubmit?.(data);
    setOpen(false);
  };

  return (
    <>
      <Modal />
      <AddFABtn
        onClick={toggleDrawerWithAuthCheck}
        defaultClass="bg-pai-400"
        hoverClass="hover:bg-pai-400 hover:border-pai-600 hover:border-2"
        pressClass="active:bg-pai-600"
      />
      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerContent onPointerDownOutside={() => setOpen(false)} className="h-[calc(100svh)] ">
          <DrawerHeader className="relative">
            <DrawerTitle>{dayjs(selectedDate).format("YYYY년 M월 D일 ddd요일")}</DrawerTitle>
            <DrawerCloseButton onClick={() => setOpen(false)} />
          </DrawerHeader>
          <AddTodoForm onSubmit={handleSubmit} />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddTodoDrawer;
