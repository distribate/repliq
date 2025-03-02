import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

const friendsListLayoutVariants = cva("flex gap-2 h-full", {
  variants: {
    variant: {
      grid: "grid grid-cols-2 auto-rows-auto",
      list: "flex-col",
    },
  },
  defaultVariants: {
    variant: "list",
  },
});

interface FriendsListLayout
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof friendsListLayoutVariants> {}

export const FriendsListLayout = forwardRef<HTMLDivElement, FriendsListLayout>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={friendsListLayoutVariants({ variant, className })}
        {...props}
      />
    );
  },
);
