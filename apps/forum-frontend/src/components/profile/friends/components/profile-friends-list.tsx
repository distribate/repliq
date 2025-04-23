import { FilteredNotFound } from "#components/templates/components/filtered-not-found";
import { friendsQuery } from "#components/friends/queries/friends-query.ts";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { friendsSortQuery } from "#components/profile/friends/queries/friends-settings-query.ts";
import { ProfileFriendsFiltering } from "#components/profile/friends/components/profile-friends-filtering.tsx";
import { type FriendWithDetails } from '@repo/types/schemas/friend/friend-types';
import { Suspense } from "react";
import { SomethingError } from "#components/templates/components/something-error";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";
import { Avatar } from "#components/user/avatar/components/avatar";
import { UserNickname } from "#components/user/name/components/nickname";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { UserDonate } from "#components/user/donate/components/donate";
import { UserCardModal } from "#components/modals/custom/components/user-card-modal";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { USER_URL } from "@repo/shared/constants/routes";

const filterFriendsByNickname = (data: FriendWithDetails[], querySearch: string) =>
  data.filter(item => item.nickname.startsWith(querySearch));

const FriendProfileCard = ({
  nickname, name_color, donate, favorite_item
}: FriendWithDetails) => {
  return (
    <div className="flex flex-col gap-y-4 w-full bg-shark-950 *:px-4 py-4 rounded-lg">
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-2 w-full items-center">
          <Suspense fallback={<Skeleton className="w-[56px] h-[56px]" />}>
            <Avatar propHeight={56} propWidth={56} nickname={nickname} />
          </Suspense>
          <div className="flex flex-col gap-1">
            <Link to={USER_URL + nickname}>
              <UserNickname
                nickname={nickname}
                nicknameColor={name_color}
                className="text-[18px] font-medium text-shark-50"
              />
            </Link>
            <UserDonate donate={donate} />
          </div>
        </div>
      </div>
      <div className="flex justify-start w-full gap-2 items-center">
        <UserCardModal
          nickname={nickname}
          withCustomTrigger={true}
          trigger={
            <Button variant="positive" className="hover:bg-[#05b458] bg-[#088d47]">
              <Typography textColor="shark_white" className="text-[16px]">
                Карточка профиля
              </Typography>
            </Button>
          }
        />
      </div>
    </div>
  );
};

const ProfileFriendsList = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const { data, isLoading, isError } = friendsQuery({ nickname, limit: 32 });
  const { searchQuery } = friendsSortQuery().data;

  if (isLoading) return <SectionSkeleton />;
  if (isError) return <SomethingError />;

  if (!data || !data.data || !data.data.length) {
    return <ContentNotFound title="Друзья не найдены" />
  }

  const friends = data.data as FriendWithDetails[]

  const filteredfriends = searchQuery && searchQuery.length > 0
    ? filterFriendsByNickname(friends, searchQuery)
    : friends;

  if (filteredfriends && !filteredfriends.length) {
    return <FilteredNotFound value={searchQuery} />;
  }

  return (
    <div className="grid auto-rows-auto grid-cols-1 lg:grid-cols-3 gap-2 w-full">
      {filteredfriends.map(friend =>
        <FriendProfileCard key={friend.nickname} {...friend} />
      )}
    </div>
  );
};

export const ProfileFriends = ({ nickname }: Pick<UserEntity, "nickname">) => {
  return (
    <Suspense>
      <div className="flex flex-col gap-4 w-full h-full">
        <ProfileFriendsFiltering nickname={nickname} />
        <ProfileFriendsList nickname={nickname} />
      </div>
    </Suspense>
  );
};