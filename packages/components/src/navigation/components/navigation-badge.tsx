import { HTMLAttributes } from 'react';
import { Typography } from '@repo/ui/src/components/typography.tsx';

interface NavigationBadgeProps extends HTMLAttributes<HTMLDivElement> {
  isActive: boolean,
  title: string
}

export const NavigationBadge = ({
  isActive, title, ...props
}: NavigationBadgeProps) => {
  return (
    <div
      data-state={isActive ? 'active' : 'disabled'}
      className="flex items-center duration-150 ease-in data-[state=active]:bg-shark-50/80
       data-[state=disabled]:bg-shark-900/80 backdrop-filter-lg group cursor-pointer justify-center px-6 py-1 rounded-[18px]"
      {...props}
    >
      <Typography
        title={title}
        className="duration-150 group-hover:duration-150 group-data-[state=active]:text-black font-medium text-[18px]"
      >
        {title}
      </Typography>
    </div>
  )
}