import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './button.tsx';

const deleteButtonVariants = cva(
  'rounded-md hover:bg-shark-600 items-center duration-150 hover:duration-150 justify-center bg-shark-700 cursor-pointer overflow-hidden flex', {
  variants: {
    variant: {
      invisible: "opacity-0 group-hover:opacity-100 absolute top-2 right-1 group-hover:duration-150"
    },
    size: {
      default: 'h-7 w-7',
      small: "h-5 w-5",
      medium: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "default"
  }
});

interface DeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof deleteButtonVariants> {
}

export const DeleteButton = ({
  size, variant, className, ...props
}: DeleteButtonProps) => {
  return (
    <Button
      className={deleteButtonVariants(( { variant, className, size }))}
      {...props}
    >
      <Trash2 size={18} className="text-red-500" />
    </Button>
  );
};