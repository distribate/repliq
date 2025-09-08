import { cva } from "class-variance-authority";

export const selectedVariant = cva(
  "flex bg-shark-900 items-center justify-center hover:bg-shark-800 duration-150 ease-in-out overflow-hidden rounded-lg",
  {
    variants: {
      variant: {
        default: "h-10 w-10",
      },
      wrapperType: {
        default: "cursor-default",
        action: "cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);