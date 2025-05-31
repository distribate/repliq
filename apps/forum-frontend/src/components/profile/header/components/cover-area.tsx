import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

export const coverAreaVariants = cva(
  `flex gap-y-4 lg:gap-y-0 w-full bg-center rounded-xl lg:mt-[4px] 
    overflow-hidden bg-cover bg-no-repeat group items-center lg:justify-between px-6 lg:px-16 py-6`,
  {
    variants: {
      variant: {
        full: `relative flex-col lg:flex-row justify-center z-[3] 
          min-h-[308px] lg:min-h-[414px] h-[308px] lg:h-[414px] max-h-[308px] lg:max-h-[414px]`,
        compact: `fixed top-0 flex-row justify-between right-0 left-0 z-[5] 
          min-h-[112px] mx-auto max-h-[112px] w-[calc(100%-8px)] sm:w-[calc(100%-32px)] md:w-[calc(100%-48px)] 2xl:w-[85%]`,
      },
      backgroundColor: {
        transparent: "bg-transparent",
        gray: "bg-shark-800",
      },
      outline: {
        default: "border-none",
        arkhont: "border-arkhont-background border-[2px]",
        authentic: "border-authentic-background border-[2px]",
        loyal: "border-loyal-background border-[2px]",
        moder: "border-moder-background border-[2px]",
        helper: "border-helper-background border-[2px]",
        dev: "border-dev-background border-[2px]",
      },
    },
    defaultVariants: {
      outline: "default",
    },
  },
);

interface CoverAreaProps extends HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof coverAreaVariants> { }

export const CoverArea = ({
  className, variant, backgroundColor, outline, ...props
}: CoverAreaProps) => {
  return <div className={coverAreaVariants({ variant, outline, className, backgroundColor })} {...props} />
};