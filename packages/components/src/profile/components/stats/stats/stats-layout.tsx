import { ReactNode } from 'react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';

type StatsTemplate = {
  title: string,
  image: string,
  children: ReactNode
}

export const StatsLayout = ({
  title, children, image
}: StatsTemplate) => {
  return (
    <div
      className="flex flex-col gap-4 lg:flex-row justify-center items-center lg:justify-between w-full overflow-hidden
      bg-shark-950 border border-white/10 rounded-md"
    >
      <div className="flex flex-col gap-y-4 h-full p-4 w-full">
        <Typography textSize="big" className="font-semibold">
          {title}
        </Typography>
        {children}
      </div>
      <div className="flex rounded-none min-h-full max-h-full h-fit relative w-fit overflow-hidden">
        <ImageWrapper
          propSrc={image}
          propAlt={title}
          width={800}
          height={800}
          className="h-[320px] w-[480px]"
        />
      </div>
    </div>
  );
};