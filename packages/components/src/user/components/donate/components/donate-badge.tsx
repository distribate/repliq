import { forwardRef, HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const userDonateBadgeVariants = cva(
  'flex items-center border-[1px] relative justify-center select-none backdrop-filter  cursor-pointer overflow-hidden rounded-md', {
    variants: {
      variant: {
        default: 'border-player-border bg-player-background/80',
        arkhont: 'border-arkhont-border bg-arkhont-background/80',
        authentic: 'border-authentic-border bg-authentic-background/80',
        helper: 'border-helper-border bg-helper-background/80',
        moder: 'border-[] bg-[]',
        loyal: 'border-loyal-border bg-loyal-background/80',
        dev: '',
      },
      size: {
        small: 'px-2 py-[1px]',
        medium: 'px-3 py-1',
      },
    },
    defaultVariants: {
      size: 'small',
    },
  },
);

interface UserDonateBadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userDonateBadgeVariants> {
}

export const UserDonateBadge = forwardRef<
  HTMLDivElement, UserDonateBadgeProps
>(({
  className,
  variant,
  size,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={userDonateBadgeVariants(({ variant, size, className }))}
      {...props}
    />
  );
});