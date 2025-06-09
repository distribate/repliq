import { Typography } from "@repo/ui/src/components/typography.tsx";
import { IconMoodWrrr } from "@tabler/icons-react";

export const SomethingError = () => {
  return (
    <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative">
      <div className="flex flex-col items-center text-red-500">
        <IconMoodWrrr size={64} className="text-red-500"/>
        <Typography className="text-xl font-bold ">
          Что-то пошло не так. Перезагрузите страницу!
        </Typography>
      </div>
    </div>
  );
};
