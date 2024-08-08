import { Drawer, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/shared/ui/drawer";
import AddTodoForm, { TodoFormData } from "./AddTodoForm";
import dayjs from "dayjs";
import { useState } from "react";
import AddTodoBtn from "./AddTodoBtn";
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface AddTodoDrawerProps {
  onSubmit?: (data: TodoFormData) => Promise<void>;
  selectedDate: Date;
}

const AddTodoDrawer = ({ onSubmit, selectedDate }: AddTodoDrawerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data } = useUserData();
  const userId = data?.user_id;
  const router = useRouter();

  const handleAuthRequire = (): boolean => {
    if (!userId) {
      toast.warn("로그인 이후 사용가능한 서비스입니다. \n로그인페이지로 이동합니다.", {
        onClose: () => {
          router.push("/login");
        }
      });
      router.push("/login");
      return false;
    }
    return true;
  };

  const handleAddTodoClick = () => {
    if (handleAuthRequire()) {
      setOpen(true);
    }
  };

  const handleSubmit = async (data: TodoFormData) => {
    await onSubmit?.(data);
    setOpen(false);
  };

  return (
    <>
      <AddTodoBtn onClick={() => setOpen(true)} />
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
