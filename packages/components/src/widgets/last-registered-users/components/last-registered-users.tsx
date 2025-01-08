import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserPreviewCard } from "#cards/components/user-preview-card/user-preview-card.tsx";
import { getLastUsers } from "../queries/get-last-registered-users.ts";

export const LastRegisteredUsers = async () => {
  const users = await getLastUsers({ limit: 8 });
  if (!users) return null;

  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold"
      >
        Новые пользователи
      </Typography>
      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 auto-rows-auto 2xl:flex *:w-fit *:2xl:max-w-[44px] 2xl:flex-wrap gap-2 w-full">
        {users.map(user => <UserPreviewCard key={user.nickname} {...user} />)}
      </div>
    </div>
  );
};