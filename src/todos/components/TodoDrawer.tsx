import { Drawer, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/ui/drawer";
import { cn } from "@/shared/utils";
import dayjs from "dayjs";

interface TodoDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  children: React.ReactNode;
  className?: string;
}

const TodoDrawer = ({ open, onClose, selectedDate, children, className }: TodoDrawerProps) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent onPointerDownOutside={onClose} className={cn("h-[100svh] px-4 pb-5 transition-all", className)}>
        <DrawerHeader className="relative">
          <DrawerTitle className="text-[0.875rem] font-normal text-gray-600">
            {dayjs(selectedDate).format("YYYY년 M월 D일 ddd요일")}
          </DrawerTitle>
          <DrawerCloseButton onClick={onClose} />
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default TodoDrawer;
