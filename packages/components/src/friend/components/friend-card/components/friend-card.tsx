import Link from 'next/link';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { UserRealName } from '#user/components/real-name/components/real-name.tsx';
import { UserDonate } from '#user/components/donate/components/donate.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { FriendCardLayout } from '#friend/components/friend-card/components/friend-card-layout.tsx';
import { FriendsQuery } from '#friends/queries/friends-query.ts';
import { FriendCardControl } from '#friend/components/friend-card/components/friend-card-control.tsx';
import { FriendCardNote } from '#friend/components/friend-card/components/friend-card-note.tsx';
import { Pin } from 'lucide-react';

export type FriendCardProps = Pick<UserEntity, 'nickname'
  | 'real_name' | 'description'
> & FriendsQuery;

export const FriendCard = ({
  ...friend
}: FriendCardProps) => {
  const {
    real_name, description, nickname, name_color, friend_id, note, status, isPinned, created_at
  } = friend;
  
  return (
    <FriendCardLayout nickname={nickname}>
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <Link href={USER_URL + nickname} className="flex items-center gap-1">
            <UserNickname nickname={nickname} className="text-lg" />
            {real_name && <UserRealName real_name={real_name} with_annotation={false} />}
          </Link>
          <UserDonate nickname={nickname} />
        </div>
        {description && (
          <div className="flex items-center w-fit">
            <Typography>{description}</Typography>
          </div>
        )}
        <FriendCardControl friend_id={friend_id} nickname={nickname} isPinned={isPinned} />
        {(isPinned || !!note) && (
          <div className="flex items-end gap-4 absolute right-4 bottom-4">
            {note && <FriendCardNote note={note} friend_id={friend_id} nickname={nickname} />}
            {isPinned && <Pin size={24} className="text-gold-500" />}
          </div>
        )}
      </div>
    </FriendCardLayout>
  );
};