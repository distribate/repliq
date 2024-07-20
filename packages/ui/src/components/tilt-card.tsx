import Tilt, { ReactParallaxTiltProps } from 'react-parallax-tilt';
import { ReactNode } from 'react';
import { cn } from '@repo/lib/utils/ui/cn.ts';

type TiltCardProps = {
  children?: ReactNode,
  className?: string
} & ReactParallaxTiltProps

export const TiltCard = ({
  children, className, ...props
}: TiltCardProps) => {
  return (
    <Tilt className={cn("flex ", className)} trackOnWindow={true} {...props}>
      {children}
    </Tilt>
  )
}