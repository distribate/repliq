import { Typography } from "@repo/ui/src/components/typography.tsx";
import { getForumStats } from "../queries/get-forum-stats.ts";

export const ForumStats = async () => {
  const stats = await getForumStats();
  if (!stats) return null;

  return (
    <div className="flex flex-col gap-y-2 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold"
      >
        Статистика
      </Typography>
      <div className="flex flex-col gap-y-2">
        <Typography>игроков: {stats.usersRegisteredForum}</Typography>
        <Typography>тредов: {stats.topicsCreatedAll}</Typography>
      </div>
    </div>
  );
};
