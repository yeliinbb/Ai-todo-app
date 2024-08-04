import { Button } from "@/shared/ui/button";
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

interface TodoModalProps {
  onSubmit?: (data: TodoFormData) => Promise<void>;
  selectedDate: Date;
}

const AddTodoModal = ({ onSubmit, selectedDate }: TodoModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (data: TodoFormData) => {
    await onSubmit?.(data);
    alert("성공!");
    setOpen(false);
  };

  return (
    <Drawer open={open}>
      <AddTodoBtn onClick={() => setOpen(true)} />
      <DrawerContent onPointerDownOutside={() => setOpen(false)}>
        <DrawerHeader>
          <DrawerTitle>{dayjs(selectedDate).format("YYYY년 M월 D일 ddd요일")}</DrawerTitle>
        </DrawerHeader>
        <AddTodoForm onSubmit={handleSubmit} />
      </DrawerContent>
    </Drawer>
  );
};

export default AddTodoModal;
