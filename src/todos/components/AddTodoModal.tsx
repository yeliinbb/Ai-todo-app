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
import AddTodoForm, { AddTodoFormData, AddTodoFormProps } from "./AddTodoForm";
import dayjs from "dayjs";
import { useState } from "react";
import AddTodoBtn from "./AddTodoBtn";

interface TodoModalProps {
  onSubmit?: (data: AddTodoFormData) => Promise<void>;
  selectedDate: Date;
}

const AddTodoModal = ({ onSubmit, selectedDate }: TodoModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: AddTodoFormData) => {
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
