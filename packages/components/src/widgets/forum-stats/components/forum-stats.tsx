import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { getForumStats } from '../queries/get-forum-stats.ts';

export const ForumStats = async() => {
  const stats = await getForumStats();
  
  return (
    <div
      className="flex flex-col gap-y-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-shark-950">
      <div className="px-2">
        <Typography textSize="big" textColor="shark_white" className="font-semibold">
          Статистика
        </Typography>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col gap-y-2 px-2 py-1">
          <Typography>
            Пользователи
          </Typography>
          <div className="flex flex-col gap-y-1 w-full">
            <Typography>
              - зарегистрированных на форуме: {stats.usersRegisteredForum}
            </Typography>
            <Typography>
              - всего: {stats.usersRegisteredServer}
            </Typography>
          </div>
        </div>
        <Separator/>
        <div className="flex flex-col gap-y-2 px-2 py-1">
          <Typography>
            Треды
          </Typography>
          <div className="flex flex-col gap-y-1 w-full">
            <Typography>
              - создано за сегодня: {stats.topicsCreatedToday}
            </Typography>
            <Typography>
              - всего: {stats.topicsCreatedAll}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}