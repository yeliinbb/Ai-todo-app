import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 box-border",
  {
    variants: {
      variant: {
        // Fill.button
        PAI: "bg-pai-400 text-system-white hover:bg-pai-400 hover:border-pai-600 hover:border-[0.13rem] active:bg-pai-600 disabled:bg-gray-200 disabled:text-gray-500",
        FAI: "bg-fai-500 text-system-white hover:bg-fai-500 hover:border-fai-700 hover:border-[0.13rem] active:bg-fai-700 disabled:bg-gray-200 disabled:text-gray-500",
        gradationPrimary:
          "bg-gradient-pai400-fai500-br text-system-white hover:bg-gradient-pai400-fai500-br hover:border-gradient-pai600-fai700-br hover:border-[0.13rem] active:bg-gradient-pai600-fai700-br disabled:bg-gradient-gray300-gray200-br disabled:text-gray-500",
        systemRed:
          "bg-system-red text-system-white hover:bg-system-red hover:border-system-red300 hover:border-[0.13rem] active:bg-system-red300 disabled:bg-gray-200 disabled:text-gray-500",
        grayScale:
          "bg-system-white text-gray-700 border-gray-400 border-[0.06rem] hover:bg-system-white hover:border-gray-600 hover:border-[0.13rem] active:bg-gray-600 active:text-gray-900 disabled:bg-gray-200 disabled:text-gray-500",

        // Transparency.button
        transPAI:
          "bg-pai-400 text-system-white hover:bg-pai-400 hover:border-pai-600 hover:border-[0.13rem] active:bg-pai-600 disabled:bg-gray-200 disabled:text-gray-500",

        // Lined.button
        linedPAI:
          "border-[0.06rem] border-pai-400 text-pai-400 hover:bg-pai-400 hover:text-system-white active:text-pai-600 active:border-pai-600 disabled:text-gray-400 disabled:border-gray-200",
        linedFAI:
          "border-[0.06rem] border-fai-500 text-fai-500 hover:bg-fai-500 hover:text-system-white active:text-fai-700 active:border-fai-700 disabled:text-gray-400 disabled:border-gray-200",
        linedGradationPAI:
          "border-[0.06rem] border-gradient-pai400-fai500-br hover:bg-gradient-pai400-fai500-br hover:text-system-white active:text-gradient-pai600-fai700-br active:border-gradient-pai600-fai700-br disabled:text-gray-400 disabled:border-gray-200",
        linedSystemRed:
          "border-[0.06rem] border-system-red text-system-red hover:bg-system-red hover:text-system-white active:text-system-red300 active:bg-system-red300 disabled:text-gray-400 disabled:border-gray-200",
        linedGrayScale:
          "border-[0.06rem] border-gray-400 text-gray-700 hover:bg-gray-400 hover:text-system-white active:bg-gray-600 active:border-gray-600 disabled:text-gray-400 disabled:border-gray-200"
      },
      size: {
        default: "typo-h7 h-[2.25rem] px-[1.5rem] py-[0.38rem] rounded-[1.5rem]",
        sm: "typo-h7 h-[2.25rem] px-[1.5rem] py-[0.38rem] rounded-[1.5rem]",
        md: "typo-h6 h-[2.75rem] px-[1.75rem] py-[0.625rem] rounded-[1.75rem]",
        lg: "typo-h5 h-[3.25rem] px-[2rem] py-[0.875rem] rounded-[2rem]",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "PAI",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ size, variant, className }))} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
