import { Drawer, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/ui/drawer";
import dayjs from "dayjs";

interface TodoDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  children: React.ReactNode;
}

const TodoDrawer = ({ open, onClose, selectedDate, children }: TodoDrawerProps) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent onPointerDownOutside={onClose} className="h-[100svh] px-4 pb-5">
        <DrawerHeader className="relative">
          <DrawerTitle className="text-gray-600">{dayjs(selectedDate).format("YYYY년 M월 D일 ddd요일")}</DrawerTitle>
          <DrawerCloseButton onClick={onClose} />
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default TodoDrawer;
