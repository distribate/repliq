import { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

const pageWrapperVariants = cva("flex overflow-hidden px-4", {
  variants: {
    variant: {
      default: "h-screen w-full items-center justify-center",
      mini: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface PageWrapperProps extends 
  HTMLAttributes<HTMLDivElement>, 
    VariantProps<typeof pageWrapperVariants> { }

export const PageWrapper = ({
  variant, className, ...props
}: PageWrapperProps) => {
  return <div className={pageWrapperVariants({ variant, className })} {...props} />;
};