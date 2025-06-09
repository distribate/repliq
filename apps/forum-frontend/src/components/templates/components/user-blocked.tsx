import { Typography } from "@repo/ui/src/components/typography.tsx";
import { IconMoodSadSquint } from "@tabler/icons-react";

export type UserBlockedProps = {
  blockedType: "blocked-by-user" | "blocked-by-you"
};

const blockedMessages: Record<"blocked-by-user" | "blocked-by-you", string> = {
  "blocked-by-user": "Этот пользователь вас заблокировал",
  "blocked-by-you": "Вы заблокировали данного пользователя",
}

export const UserBlocked = ({ blockedType }: UserBlockedProps) => {
  return (
    <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative z-[4]">
      <div className="flex flex-col items-center gap-y-2 p-6">
        <IconMoodSadSquint size={64} className='text-shark-300' />
        <Typography className="text-xl font-bold text-shark-50">
          {blockedMessages[blockedType]}
        </Typography>
      </div>
    </div>
  );
};
