import { cva } from "class-variance-authority";

export const moreVariant = cva(`flex items-center bg-shark-900 justify-center aspect-square rounded-2xl`, {
  variants: {
    size: {
      small: "h-6 max-h-6",
      med: "h-10 max-h-10",
      large: "h-12 max-h-12"
    }
  },
  defaultVariants: {
    size: "med"
  }
})