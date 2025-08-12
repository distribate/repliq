import { HTMLAttributes } from "react";
import { Typography } from "@repo/ui/src/components/typography.tsx";

interface NavigationBadgeProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const NavigationBadge = ({
  title, ...props
}: NavigationBadgeProps) => {
  return (
    <div
      className="flex items-center duration-150 *:duration-150 
        select-none data-[state=active]:bg-shark-200 rounded-xl group data-[state=inactive]:bg-shark-400/40 cursor-pointer justify-center px-4 py-2"
      {...props}
    >
      <Typography
        title={title}
        className="text-nowrap 
        group-data-[state=inactive]:text-shark-50 group-data-[state=active]:text-shark-950 font-semibold text-lg"
      >
        {title}
      </Typography>
    </div>
  );
};