import { DropdownWrapper, DropdownWrapperProps } from './dropdown-wrapper.tsx';
import { MoreVertical } from 'lucide-react';
import { forwardRef, HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const moreWrapperVariants = cva('flex bg-shark-900/10 backdrop-blur-lg rounded-md items-center justify-center', {
  variants: {
    variant: {
      default: 'p-2',
      small: 'p-1',
      medium: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface MoreWrapperProps
  extends Omit<DropdownWrapperProps, 'trigger' | 'content'>,
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof moreWrapperVariants> {}

export const MoreWrapper = forwardRef<
  HTMLDivElement, MoreWrapperProps
>(({ children, className, variant, ...props }, ref) => {
  return (
    <DropdownWrapper
      trigger={
        <div className={moreWrapperVariants(({ variant, className }))}>
          <MoreVertical size={20} className="text-shark-300" />
        </div>
      }
      content={
        <div ref={ref} className="flex flex-col gap-y-2 w-full" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      }
      {...props}
    />
  );
});