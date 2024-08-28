import { DropdownWrapper } from './dropdown-wrapper.tsx';
import { MoreVertical } from 'lucide-react';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const moreWrapperVariants = cva('flex bg-shark-900 rounded-lg items-center justify-center', {
  variants: {
    variant: {
      default: 'p-2',
      small: 'p-1',
    },
  },
  defaultVariants: {
    variant: "default"
  }
});

interface MoreWrapper
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof moreWrapperVariants> {
}

export const MoreWrapper = forwardRef<
  HTMLDivElement, MoreWrapper
>(({ children, className, variant, ...props }, ref) => {
    return (
      <DropdownWrapper
        properties={{
          sideAlign: 'top',
          contentAlign: 'start',
          contentClassname: 'w-[250px]',
        }}
        trigger={
          <div className={moreWrapperVariants(({ variant, className }))}>
            <MoreVertical size={20} className="text-shark-300" />
          </div>
        }
        content={
          <div ref={ref} className="flex flex-col gap-y-2 w-full" {...props}>
            {children}
          </div>
        }
      />
    );
  },
);