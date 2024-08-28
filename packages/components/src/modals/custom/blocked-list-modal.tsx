import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Fragment } from 'react';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import {
  userBlockedQuery
} from '../../cards/components/user-personal-card/components/account-settings/queries/user-blocked-query.ts';
import { UserBlockedCard } from '../../cards/components/user-blocked-card/components/user-blocked-card.tsx';

export const BLOCKED_LIST_MODAL_NAME = "blocked-list"

export const BlockedListModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  if (!currentUser) return;
  
  const { data: userBlocked } = userBlockedQuery({
    nickname: currentUser.nickname,
  });
  
  return (
    <DialogWrapper
      name={BLOCKED_LIST_MODAL_NAME}
      trigger={
        <Typography className="text-base">
          {userBlocked?.length || 0}
        </Typography>
      }
    >
      <div className="flex flex-col gap-y-4 w-full items-center">
        <Typography variant="dialogTitle" className="px-4">
          Черный список
        </Typography>
        {userBlocked && !userBlocked.length && (
          <div className="self-start w-full px-2">
            <Typography className="text-shark-300" textSize="small">список пуст</Typography>
          </div>
        )}
        <div className="flex flex-col gap-y-1 w-full overflow-y-scroll max-h-[600px]">
          {userBlocked?.map(user => (
            <Fragment key={user.id}>
              <UserBlockedCard
                name_color={user.name_color}
                nickname={user.nickname}
                time={user.added_at}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </DialogWrapper>
  );
}