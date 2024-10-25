'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { TabsList, TabsTrigger } from '@repo/ui/src/components/tabs.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { FriendsIncomingTrigger, FriendsOutgoingTrigger, FriendsTrigger } from './friends-triggers.tsx';

export type FriendsControlProps = Pick<UserEntity, "nickname">

export const FriendsControl = ({
  nickname,
}: FriendsControlProps) => {
  return (
    <TabsList className="flex flex-col gap-y-2 bg-shark-950 w-full border border-shark-800 rounded-lg p-4">
      {/* different friends list */}
      <TabsTrigger
        value="all-friends-list"
        className="flex justify-start p-3 border border-white/10 w-full gap-2 group"
      >
        <Typography textSize="small">
          Мои друзья
        </Typography>
        <FriendsTrigger nickname={nickname} />
      </TabsTrigger>
      <TabsTrigger
        value="incoming-friends-list"
        className="flex justify-start p-3 border border-white/10 w-full gap-2 group"
      >
        <Typography textSize="small">
          Входящие заявки
        </Typography>
        <FriendsIncomingTrigger />
      </TabsTrigger>
      <TabsTrigger
        value="outgoing-friends-list"
        className="flex justify-start p-3 border border-white/10 w-full gap-2 group"
      >
        <Typography textSize="small">
          Исходящие заявки
        </Typography>
        <FriendsOutgoingTrigger />
      </TabsTrigger>
      <Separator />
      <TabsTrigger
        value="searching-friends-list"
        className="flex justify-start p-3 border border-white/10 w-full gap-2 group"
      >
        <Typography textSize="small">
          Поиск друзей
        </Typography>
      </TabsTrigger>
    </TabsList>
  );
};