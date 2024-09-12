import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/lib/utils/ui/cn.ts';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { GearLoader } from './gear-loader.tsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap' +
  ' text-sm font-medium transition-all' +
  ' focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2' +
  ' disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        link: 'underline-offset-4 hover:underline',
        action: 'hover:bg-pink-800 bg-pink-700 border border-pink-400',
        positive: 'hover:bg-green-800 bg-green-700 border border-green-400',
        negative: 'hover:bg-red-800 bg-red-700 border border-red-400',
        pending: 'hover:bg-contessa-800 bg-contessa-700 border border-contessa-400',
        minecraft: 'border-[2px] text-shark-50 border-black/80 rounded-none shadow-[inset_0px_-2px_1px_rgba(0,0,0,0.4),inset_-0px_2px_1px_rgba(255,255,255,0.4)]',
      },
      effect: {
        none: '',
        pressed: 'shadow-[2px_2px_0px_2px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none',
      },
      rounded: {
        none: '',
        default: 'rounded-lg',
      },
      size: {
        full: 'h-fit w-full',
        default: 'px-4 py-2',
        sm: 'px-3 py-1',
        md: 'px-6 py-4',
        lg: 'px-8',
        icon: 'w-10',
      },
      state: {
        default: 'bg-shark-800 border border-shark-700',
        active: 'hover:bg-caribbean-green-800 bg-caribbean-green-700 border border-caribbean-green-400',
      },
      border: {
        default: 'border-[1px] border-white/10',
        without: 'border-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  },
);

interface Button {
  asChild?: boolean;
  pending?: boolean,
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>, Button {
}

const Button = forwardRef<
  HTMLButtonElement, ButtonProps
>(({
      className, effect, variant, rounded, size, border, pending, state, asChild = false, ...props
    }, ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, state, effect, rounded, border, size, className }))}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-2">
          {pending && (
            <GearLoader height={16} width={16} />
          )}
          {props.children}
        </div>
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };