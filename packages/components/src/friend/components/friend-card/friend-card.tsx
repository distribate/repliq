import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import Link from 'next/link';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { UserNickname } from '../../../user/components/name/components/nickname.tsx';
import { UserRealName } from '../../../user/components/real-name/components/real-name.tsx';
import { UserDonate } from '../../../user/components/donate/components/donate.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import type { FriendsQuery } from '../../../friends/queries/friends-query.ts';
import { FriendCardControl } from './components/friend-card-control.tsx';
import { Pin } from 'lucide-react';
import { FriendCardNote } from './components/friend-card-note.tsx';

export type FriendCardProps = Pick<UserEntity, 'nickname' | 'real_name' | 'description'>
  & FriendsQuery

export const FriendCard = ({
  nickname, real_name, description, friend_id, isPinned, note
}: FriendCardProps) => {
  return (
    <div className="flex relative items-center gap-4 w-full bg-shark-950 border border-shark-800 rounded-lg p-4">
      <Avatar nickname={nickname} propHeight={112} propWidth={112} className="rounded-lg" />
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <Link href={USER_URL + nickname} className="flex items-center gap-1">
            <UserNickname nickname={nickname} className="text-lg" />
            {real_name && <UserRealName real_name={real_name} with_annotation={false} />}
          </Link>
          <UserDonate nickname={nickname} />
        </div>
        <div className="flex items-center w-fit">
          <Typography>{description}</Typography>
        </div>
        <FriendCardControl friend_id={friend_id} nickname={nickname} isPinned={isPinned} />
        {(isPinned || !!note) && (
          <div className="flex items-end gap-4 absolute right-4 bottom-4">
            {note && <FriendCardNote note={note} friend_id={friend_id} nickname={nickname} />}
            {isPinned && <Pin size={24} className="text-gold-500" />}
          </div>
        )}
      </div>
    </div>
  );
};