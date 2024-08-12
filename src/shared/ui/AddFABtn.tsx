import AddContentBtn from "@/components/icons/AddContentBtn";
import { Button, ButtonProps } from "@/shared/ui/button";
import { cn } from "@/shared/utils";

interface AddFABtnProps extends ButtonProps {
  onClick: () => void;
  defaultClass: string;
  hoverClass: string;
  pressClass: string;
}

const AddFABtn = ({ onClick, className, defaultClass, hoverClass, pressClass, ...rest }: AddFABtnProps) => {
  return (
    <div className="flex justify-center items-center fixed bottom-[76px] right-0 w-[60px] h-[60px] bg-grayTrans-90020 rounded-full m-4">
      <Button
        className={cn("w-[52px] h-[52px] rounded-full transition-all", defaultClass, hoverClass, pressClass, className)}
        onClick={onClick}
        {...rest}
      >
        <AddContentBtn className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </Button>
    </div>
  );
};

export default AddFABtn;
