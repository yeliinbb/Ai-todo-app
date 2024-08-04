import { Button, ButtonProps } from "@/shared/ui/button";
import { cn } from "@/shared/utils";
import { HTMLAttributes } from "react";
import { IoIosAddCircle } from "react-icons/io";

const AddTodoBtn = ({ className, ...rest }: ButtonProps) => {
  return (
    <div className="flex justify-center items-center fixed bottom-14 right-4 w-[64px] h-[64px] bg-grayTrans-90020 rounded-full">
      <Button className={cn("w-[56px] h-[56px] rounded-full bg-pai-400 text-xl", className)} {...rest}>
        +
      </Button>
    </div>
  );
};

export default AddTodoBtn;
