import { Typography } from "@repo/ui/src/components/typography.tsx";
import { IconMoodSilence } from "@tabler/icons-react";

export const ProfilePrivated = () => {
  return (
    <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative z-[4]">
      <div className="flex flex-col items-center gap-y-2 p-6">
        <div className="bg-shark-700 p-4 flex items-center justify-center rounded-lg">
          <IconMoodSilence size={64} className="text-shark-300" />
        </div>
        <Typography className="text-xl text-center font-bold text-shark-50">
          Пользователь предпочел скрыть свой профиль.
        </Typography>
        <Typography className="text-center text-shark-300 text-base">
          Добавьте в друзья, чтобы увидеть содержимое профиля
        </Typography>
      </div>
    </div>
  );
};