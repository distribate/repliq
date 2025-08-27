import { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

const userDonateBadgeVariants = cva(
  "flex items-center border relative justify-center select-none backdrop-filter cursor-pointer overflow-hidden rounded-sm",
  {
    variants: {
      variant: {
        default: "border-player-border bg-player-background/80"
      },
      size: {
        small: "px-2 py-[2px]",
        medium: "px-3 py-1",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

interface UserDonateBadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof userDonateBadgeVariants> { }

export const UserDonateBadge = ({ className, variant, size, ...props }: UserDonateBadgeProps) => {
  return (
    <div
      className={userDonateBadgeVariants({ variant, size, className })}
      {...props}
    />
  );
}