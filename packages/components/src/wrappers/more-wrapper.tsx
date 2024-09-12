import { DropdownWrapper } from './dropdown-wrapper.tsx';
import { MoreVertical } from 'lucide-react';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const moreWrapperVariants = cva('flex bg-shark-900 rounded-lg items-center justify-center', {
  variants: {
    variant: {
      default: 'p-2',
      small: 'p-1',
      selected: "h-10 w-10 border border-white/10"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

interface MoreWrapper
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof moreWrapperVariants> {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export const MoreWrapper = forwardRef<
  HTMLDivElement, MoreWrapper
>(({ children, className, position, variant, ...props }, ref) => {
    return (
      <DropdownWrapper
        properties={{
          sideAlign: position === 'top-left' || position === 'top-right' ? 'top' : 'bottom',
          contentAlign: position === 'top-left' || position === 'bottom-left' ? 'end' : 'start',
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