import * as React from 'react';

import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import { cn, withCn, withRef, withVariants } from '@udecode/cn';
import { type VariantProps, cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import { Separator } from './separator';
import { withTooltip } from './tooltip';

export const Toolbar = withCn(
  ToolbarPrimitive.Root,
  'relative flex items-center select-none'
);

const a = cn('flex items-center');

export const ToolbarToggleGroup = withCn(
  ToolbarPrimitive.ToolbarToggleGroup,
  'flex items-center'
);

export const ToolbarLink = withCn(
  ToolbarPrimitive.Link,
  'font-medium underline underline-offset-4'
);

export const ToolbarSeparator = withCn(
  ToolbarPrimitive.Separator,
  'mx-2 my-1 w-px shrink-0 bg-shark-600'
);

const toolbarButtonVariants = cva(
  cn(
    `inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm 
    font-medium whitespace-nowrap text-shark-200 transition-colors disabled:pointer-events-none 
    disabled:opacity-50 [&_svg:not([data-icon])]:size-4`
  ),
  {
    defaultVariants: {
      size: 'sm',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 px-3',
        lg: 'h-11 px-5',
        sm: 'h-7 px-2',
      },
      variant: {
        default:'bg-transparent hover:bg-shark-800 hover:text-shark-300 aria-checked:bg-shark-500 aria-checked:text-shark-500',
        outline:'border border-shark-500 bg-transparent hover:bg-shark-300 hover:text-shark-100',
      },
    },
  }
);

const dropdownArrowVariants = cva(
  cn(
    'inline-flex items-center justify-center rounded-r-md text-sm font-medium text-shark-300 transition-colors disabled:pointer-events-none disabled:opacity-50'
  ),
  {
    defaultVariants: {
      size: 'sm',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 w-6',
        lg: 'h-11 w-8',
        sm: 'h-7 w-4',
      },
      variant: {
        default:
          'bg-transparent hover:bg-shark-700 hover:text-shark-500 aria-checked:bg-shark-300 aria-checked:text-accent-foreground',
        outline:
          'border border-l-0 border-input bg-transparent hover:bg-shark-300 hover:text-shark-300',
      },
    },
  }
);

const ToolbarButton = withTooltip(
  React.forwardRef<
    React.ElementRef<typeof ToolbarToggleItem>,
    {
      isDropdown?: boolean;
      pressed?: boolean;
    } & Omit<
      React.ComponentPropsWithoutRef<typeof ToolbarToggleItem>,
      'asChild' | 'value'
    > &
      VariantProps<typeof toolbarButtonVariants>
  >(
    (
      { children, className, isDropdown, pressed, size, variant, ...props },
      ref
    ) => {
      return typeof pressed === 'boolean' ? (
        <ToolbarToggleGroup
          disabled={props.disabled}
          value="single"
          type="single"
        >
          <ToolbarToggleItem
            ref={ref}
            className={cn(
              toolbarButtonVariants({
                size,
                variant,
              }),
              isDropdown && 'justify-between gap-1 pr-1',
              className
            )}
            value={pressed ? 'single' : ''}
            {...props}
          >
            {isDropdown ? (
              <>
                <div className="flex flex-1 items-center gap-2 whitespace-nowrap">
                  {children}
                </div>
                <div>
                  <ChevronDown
                    className="size-3.5 text-shark-300"
                    data-icon
                  />
                </div>
              </>
            ) : (
              children
            )}
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      ) : (
        <ToolbarPrimitive.Button
          ref={ref}
          className={cn(
            toolbarButtonVariants({
              size,
              variant,
            }),
            isDropdown && 'pr-1',
            className
          )}
          {...props}
        >
          {children}
        </ToolbarPrimitive.Button>
      );
    }
  )
);

export { ToolbarButton };

export const ToolbarSplitButton = React.forwardRef<
  React.ElementRef<typeof ToolbarButton>,
  React.ComponentPropsWithoutRef<typeof ToolbarButton>
>(({ children, className, ...props }, ref) => {
  return (
    <ToolbarButton
      ref={ref}
      className={cn('group flex gap-0 px-0 hover:bg-transparent', className)}
      {...props}
    >
      {children}
    </ToolbarButton>
  );
});

export const ToolbarSplitButtonPrimary = withTooltip(
  React.forwardRef<
    React.ElementRef<typeof ToolbarToggleItem>,
    Omit<React.ComponentPropsWithoutRef<typeof ToolbarToggleItem>, 'value'>
  >(({ children, className, size, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          toolbarButtonVariants({
            size,
            variant,
          }),
          'rounded-r-none',
          'group-data-[pressed=true]:bg-shark-400 group-data-[pressed=true]:text-shark-500',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  })
);

export const ToolbarSplitButtonSecondary = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'span'> &
    VariantProps<typeof dropdownArrowVariants>
>(({ className, size, variant, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        dropdownArrowVariants({
          size,
          variant,
        }),
        'group-data-[pressed=true]:bg-shark-500 group-data-[pressed=true]:text-shark-600',
        className
      )}
      onClick={(e) => e.stopPropagation()}
      role="button"
      {...props}
    >
      <ChevronDown className="size-3.5 text-shark-700" data-icon />
    </span>
  );
});

ToolbarSplitButton.displayName = 'ToolbarButton';

export const ToolbarToggleItem = withVariants(
  ToolbarPrimitive.ToggleItem,
  toolbarButtonVariants,
  ['variant', 'size']
);

export const ToolbarGroup = withRef<'div'>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'group/toolbar-group',
        'relative has-[button]:flex',
        className
      )}
    >
      <div className="flex items-center">{children}</div>
      <div className="mx-1.5 py-0.5 group-last/toolbar-group:hidden!">
        <Separator orientation="vertical" />
      </div>
    </div>
  );
});