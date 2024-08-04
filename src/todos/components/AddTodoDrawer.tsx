import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/shared/ui/drawer";
import AddTodoForm, { TodoFormData } from "./AddTodoForm";
import dayjs from "dayjs";
import { useState } from "react";
import AddTodoBtn from "./AddTodoBtn";
import { IoCloseCircleOutline } from "react-icons/io5";

interface AddTodoDrawerProps {
  onSubmit?: (data: TodoFormData) => Promise<void>;
  selectedDate: Date;
}

const AddTodoDrawer = ({ onSubmit, selectedDate }: AddTodoDrawerProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (data: TodoFormData) => {
    await onSubmit?.(data);
    alert("성공!");
    setOpen(false);
  };

  return (
    <Drawer open={open}>
      <AddTodoBtn onClick={() => setOpen(true)} />
      <DrawerContent onPointerDownOutside={() => setOpen(false)} className="h-[739px] rounded-t-[48px]">
        <DrawerHeader>
          <DrawerTitle className="text-gray-600 font-thin font-md">
            {dayjs(selectedDate).format("YYYY년 M월 D일 ddd요일")}
          </DrawerTitle>
          <IoCloseCircleOutline className="w-8 h-8 float-right text-gray-400" />
        </DrawerHeader>
        <AddTodoForm onSubmit={handleSubmit} />
      </DrawerContent>
    </Drawer>
  );
};

export default AddTodoDrawer;
