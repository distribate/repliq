import { Typography } from "@repo/ui/src/components/typography.tsx";
import { IconMoodSilence } from "@tabler/icons-react";

export const ProfilePrivated = () => {
  return (
    <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative z-[4]">
      <div className="flex flex-col items-center gap-y-2 p-6">
        <IconMoodSilence size={64} className="text-shark-300" />
        <Typography className="text-xl font-bold text-shark-50">
          Пользователь предпочел скрыть свой профиль.
        </Typography>
        <Typography className="text-shark-200 text-base">
          Добавьте в друзья, чтобы увидеть содержимое профиля
        </Typography>
      </div>
    </div>
  );
};