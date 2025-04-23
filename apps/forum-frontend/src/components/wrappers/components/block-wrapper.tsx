import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

const blockWrapperVariants = cva("flex rounded-lg w-full ", {
  variants: {
    variant: {
      default: "",
    },
    backgroundColor: {
      shark_white: "bg-shark-900",
      shark_black: "bg-primary-color",
    },
    borderType: {
      none: "border-none",
      default: "border border-shark-700",
    },
    padding: {
      default: "px-4 py-2",
      without: "p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    backgroundColor: "shark_black",
    padding: "default",
  },
});

interface BlockWrapperProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof blockWrapperVariants> {}

export const BlockWrapper = forwardRef<HTMLDivElement, BlockWrapperProps>(
  (
    { className, backgroundColor, variant, padding, borderType, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={blockWrapperVariants({
          variant,
          borderType,
          padding,
          backgroundColor,
          className,
        })}
        {...props}
      />
    );
  },
);
