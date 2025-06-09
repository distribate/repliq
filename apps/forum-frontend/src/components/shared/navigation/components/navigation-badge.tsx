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
      className="flex items-center duration-150 select-none ease-in data-[state=active]:bg-green-800/80
       rounded-xl group cursor-pointer justify-center py-4"
      {...props}
    >
      <Typography
        title={title}
        className="duration-150 group-hover:duration-150 text-shark-50 font-semibold text-[18px]"
      >
        {title}
      </Typography>
    </div>
  );
};
