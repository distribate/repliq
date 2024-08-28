import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { checkFriendRequestStatus } from '@repo/lib/helpers/check-friend-request-status.ts';
import { FriendsSearchingCardActionAdd, FriendsSearchingCardActionDeny } from './friends-searching-card-buttons.tsx';
import { FriendsSearchingCardProps } from './friends-searching-card.tsx';

export const FriendsSearchingCardAction = ({
  nickname: reqUserNickname,
}: Pick<FriendsSearchingCardProps, 'nickname'>) => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const reqStatus = checkFriendRequestStatus(reqUserNickname);
  
  if (!currentUser || !reqStatus) return null;
  
  return (
    <div
      onClick={e => e.stopPropagation()}
      className="opacity-0 absolute -bottom-2 -right-2 flex items-center justify-end w-full
        translate-y-[6px] transition-all ease-in-out duration-300
        group-hover:translate-y-0 group-hover:opacity-100"
    >
      {reqStatus === 'default' && (
        <FriendsSearchingCardActionAdd recipient={reqUserNickname} />
      )}
      {reqStatus === 'deny' && (
        <FriendsSearchingCardActionDeny recipient={reqUserNickname}/>
      )}
    </div>
  );
};