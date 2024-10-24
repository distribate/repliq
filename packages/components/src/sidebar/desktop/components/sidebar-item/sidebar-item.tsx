import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const sidebarItemVariants = cva('flex gap-x-3 items-center hover:bg-white/10 rounded-[12px] w-full', {
  variants: {
    variant: {
      expanded: 'justify-start',
      compacted: 'justify-center',
    },
  },
});

interface SidebarItemProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarItemVariants> {
}

export const SidebarItem = ({
  variant, className, ...props
}: SidebarItemProps) => {
  return (
    <div
      className={sidebarItemVariants(({ variant, className }))}
      {...props}
    />
  );
};