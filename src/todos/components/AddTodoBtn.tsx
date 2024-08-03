import { HTMLAttributes } from "react";
import { IoIosAddCircle } from "react-icons/io";

const AddTodoBtn = (props: HTMLAttributes<SVGElement>) => {
  return <IoIosAddCircle className="rounded-full text-pai-400 w-[56px] h-[56px]" {...props} />;
};

export default AddTodoBtn;
