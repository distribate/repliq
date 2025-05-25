// @ts-ignore
import Elci from "@repo/assets/gifs/elci-minecraft.gif";
import { Typography } from "@repo/ui/src/components/typography.tsx";

interface ContentNotFoundProps {
  title: string;
}

export const ContentNotFound = ({ title }: ContentNotFoundProps) => {
  return (
    <div className="flex w-full items-center justify-center h-full gap-6 md:gap-12 px-6 md:px-12 py-4 md:py-6 relative">
      <div className="flex flex-col items-center gap-y-4">
        <div className="flex items-center justify-center bg-shark-900 p-2 md:p-4 rounded-xl">
          <img
            src={Elci}
            alt=""
            className="-ml-6"
            width={156}
            height={156}
          />
        </div>
        <Typography className="text-xl text-center font-bold text-shark-50">
          {title}
        </Typography>
      </div>
    </div>
  );
};
