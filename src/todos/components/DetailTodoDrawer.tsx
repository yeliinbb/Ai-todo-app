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
import { TodoFormData } from "./AddTodoForm";
import dayjs from "dayjs";
import { useState } from "react";
import AddTodoBtn from "./AddTodoBtn";
import EditTodoForm, { EditTodoFormProps } from "./EditTodoForm";

const DetailTodoDrawer = ({ todo, onSubmit, selectedDate }: EditTodoFormProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (data: TodoFormData) => {
    await onSubmit?.(data);
    alert("성공!");
    setOpen(false);
  };

  return (
    <Drawer open={open}>
      {/* <AddTodoBtn onClick={() => setOpen(true)} /> */}
      {/* 여기에 TodoCard 컴포넌트 내의 DropdownMenuItem 수정을 클릭했을 때 이동되는 */}
      <DrawerContent onPointerDownOutside={() => setOpen(false)}>
        <DrawerHeader>
          <DrawerTitle>{dayjs(selectedDate).format("YYYY년 M월 D일 ddd요일")}</DrawerTitle>
        </DrawerHeader>
        <EditTodoForm todo={todo} onSubmit={onSubmit} selectedDate={selectedDate} />
      </DrawerContent>
    </Drawer>
  );
};

export default DetailTodoDrawer;
