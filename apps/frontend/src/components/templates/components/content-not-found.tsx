import { Typography } from "@repo/ui/src/components/typography.tsx";
import { IconMountainFilled } from "@tabler/icons-react";

interface ContentNotFoundProps {
  title: string;
}

export const ContentNotFound = ({ title }: ContentNotFoundProps) => {
  return (
    <div className="flex w-full items-center justify-center h-full gap-4 md:gap-12 px-6 md:px-12 py-4 md:py-6 relative">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center p-2 md:p-4 rounded-xl">
          <IconMountainFilled size={64} className="text-shark-300" />
        </div>
        <Typography className="text-xl text-center font-bold text-shark-50">
          {title}
        </Typography>
      </div>
    </div>
  );
};
