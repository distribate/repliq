import { HTMLAttributes } from "react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { cva } from "class-variance-authority";

interface NavigationBadgeProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const badgeVariant = cva(`flex items-center duration-150 *:duration-150 select-none 
  data-[state=active]:bg-shark-200 rounded-xl group data-[state=inactive]:bg-shark-400/40 cursor-pointer justify-center px-4 py-2
`)

export const NavigationBadge = ({
  title, className, children, ...props
}: NavigationBadgeProps) => {
  return (
    <div className={badgeVariant({ className })} {...props}>
      <Typography
        title={title}
        className="text-nowrap 
        group-data-[state=inactive]:text-shark-50 group-data-[state=active]:text-shark-950 font-semibold text-lg"
      >
        {title}
      </Typography>
      {children}
    </div>
  );
};