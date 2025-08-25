import { cva } from "class-variance-authority";

export const selectedVariant = cva(
  "flex hover:bg-shark-800/60 duration-150 overflow-hidden rounded-lg",
  {
    variants: {
      variant: {
        default: "p-2",
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