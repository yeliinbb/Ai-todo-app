import { cn } from "@/shared/utils";
import { HTMLAttributes } from "react";

const Plus = ({ className, ...rest }: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
      {...rest}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.8333 4.16683C10.8333 3.70659 10.4602 3.3335 9.99992 3.3335C9.53968 3.3335 9.16659 3.70659 9.16659 4.16683V9.16683H4.16659C3.70635 9.16683 3.33325 9.53993 3.33325 10.0002C3.33325 10.4604 3.70635 10.8335 4.16659 10.8335H9.16659V15.8335C9.16659 16.2937 9.53968 16.6668 9.99992 16.6668C10.4602 16.6668 10.8333 16.2937 10.8333 15.8335V10.8335H15.8333C16.2935 10.8335 16.6666 10.4604 16.6666 10.0002C16.6666 9.53993 16.2935 9.16683 15.8333 9.16683H10.8333V4.16683Z"
        fill="CurrentColor"
      />
    </svg>
  );
};

export default Plus;
