import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

export const headAreaVariants = cva(
  `flex gap-y-4 lg:gap-y-0 relative w-full bg-center rounded-xl lg:mt-[4px] 
    overflow-hidden items-center lg:justify-between px-6 lg:px-16 py-6 relative flex-col lg:flex-row justify-center z-[3]
          min-h-[308px] lg:min-h-[414px] h-[308px] lg:h-[414px] max-h-[308px] lg:max-h-[414px]`,
  {
    variants: {
      backgroundColor: {
        transparent: "bg-transparent",
        gray: "bg-shark-800",
      },
    }
  },
);

interface HeadAreaProps extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof headAreaVariants> { outline: string | null }

export const HeadArea = ({
  className, backgroundColor, outline, ...props
}: HeadAreaProps) => {
  const borderStyleOpts = outline ? { borderColor: outline, borderWidth: '8px' } : {};

  return (
    <div
      className={headAreaVariants({ className, backgroundColor })}
      style={{ ...borderStyleOpts }}
      {...props}
    />
  )
};