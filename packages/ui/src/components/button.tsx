import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@repo/lib/utils/ui/cn.ts";
import { ButtonHTMLAttributes } from "react";
import { WindowLoader } from "./window-loader.tsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap" +
  " text-sm font-medium transition-all active:scale-[.98]" +
  " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" +
  " disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        action: "hover:bg-pink-700 bg-pink-800",
        positive: "hover:bg-green-700 bg-green-800",
        negative: "hover:bg-red-700 bg-red-800",
        pending: "hover:bg-contessa-700 bg-contessa-800",
      },
      effect: {
        none: "",
        pressed: "shadow-[2px_2px_0px_2px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
      },
      rounded: {
        none: "",
        default: "rounded-md",
      },
      size: {
        full: "h-fit w-full",
        default: "px-4 py-2",
        sm: "px-3 py-1",
        md: "px-6 py-4",
        lg: "px-8",
        icon: "w-10",
      },
      state: {
        default: "bg-shark-800"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  pending?: boolean;
}

const Button = ({ 
  className, effect, variant, rounded, size, pending, state, asChild = false, ...props 
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, state, effect, rounded, size, className }))}
      {...props}
    >
      <div className="flex items-center gap-2">
        {pending && <WindowLoader size="small" />}
        {props.children}
      </div>
    </Comp>
  );
}

Button.displayName = "Button";

export { Button, buttonVariants };