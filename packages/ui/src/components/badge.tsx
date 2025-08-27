import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const badgeVariants = cva(
  `flex rounded-md text-[12px]
		text-shark-50 font-normal bg-green-600 outline-none border-none`,
  {
    variants: {
      size: {
        small: "px-[4px] py-0",
        medium: "px-4 py-1",
      },
      state: {
        default: "",
        active: "bg-green-600",
      }
    },
    defaultVariants: {
      state: "default",
      size: "small",
    },
  },
);

interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

export const Badge = ({ className, size, state, ...props }: BadgeProps) => {
  return (
    <div
      className={badgeVariants({ size, state, className })}
      {...props}
    />
  );
}