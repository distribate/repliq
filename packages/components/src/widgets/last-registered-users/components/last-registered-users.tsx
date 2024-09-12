import { Typography } from '@repo/ui/src/components/typography.tsx';
import { UserPreviewCard } from '../../../cards/components/user-preview-card/user-preview-card.tsx';
import { getLastUsers } from '../queries/get-last-registered-users.ts';

export const LastRegisteredUsers = async() => {
  const users = await getLastUsers();
  
  if (!users) return null;
  
  return (
    <div
      className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-shark-950">
      <div className="px-2">
        <Typography textSize="big" textColor="shark_white" className="font-semibold">
          Новые пользователи
        </Typography>
      </div>
      <div className="flex flex-col gap-1 hover:*:bg-shark-900/60 *:rounded-md">
        {users.map(user => (
          <UserPreviewCard key={user.nickname} {...user}/>
        ))}
      </div>
    </div>
  )
}