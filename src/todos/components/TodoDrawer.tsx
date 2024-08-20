import { Drawer, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/ui/drawer";
import { cn } from "@/shared/utils";
import dayjs from "dayjs";

interface TodoDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  children: React.ReactNode;
  className?: string;
  modal?: boolean;
}

const TodoDrawer = ({ open, onClose, selectedDate, children, className, modal }: TodoDrawerProps) => {
  return (
    <Drawer open={open} onClose={onClose} modal={modal ?? false}>
      <DrawerContent
        onPointerDownOutside={onClose}
        className={cn(
          "h-[calc(100svh-4.625rem)] px-4 pb-5 transition-all",
          "desktop:h-[calc(100svh-4.625rem)] desktop:w-[calc(21.75rem+(100vw-1200px)*0.675] desktop:left-1/3 desktop:-translate-x-1/2 desktop:-translate-y-1/2",
          className
        )}
      >
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
