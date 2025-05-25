import { FilteredNotFound } from "#components/templates/components/filtered-not-found";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { friendsSortAtom } from "#components/profile/friends/models/friends-sort.model";
import { ProfileFriendsFiltering } from "#components/profile/friends/components/profile-friends-filtering.tsx";
import { type FriendWithDetails } from '@repo/types/schemas/friend/friend-types';
import { Suspense } from "react";
import { SomethingError } from "#components/templates/components/something-error";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";
import { Avatar } from "#components/user/avatar/components/avatar";
import { UserNickname } from "#components/user/name/nickname";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { UserDonate } from "#components/user/donate/components/donate";
import { UserCardModal } from "#components/modals/custom/components/user-card-modal";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { USER_URL } from "@repo/shared/constants/routes";
import { reatomComponent } from "@reatom/npm-react";
import { friendsAction, friendsDataAtom } from "../models/profile-friends.model";

const filterFriendsByNickname = (data: FriendWithDetails[], querySearch: string) =>
  data.filter(item => item.nickname.startsWith(querySearch));

const FriendProfileCard = ({ nickname, name_color, donate }: FriendWithDetails) => {
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
        <UserCardModal nickname={nickname} withCustomTrigger={true} trigger={
          <Button variant="positive" className="hover:bg-[#05b458] bg-[#088d47]">
            <Typography textColor="shark_white" className="text-[16px]">
              Карточка профиля
            </Typography>
          </Button>
        } />
      </div>
    </div>
  );
};

const ProfileFriendsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(friendsDataAtom) as FriendWithDetails[]
  const isLoading = ctx.spy(friendsAction.statusesAtom).isPending
  const isError = ctx.spy(friendsAction.statusesAtom).isRejected

  if (isLoading) return <SectionSkeleton />;
  if (isError) return <SomethingError />;

  if (!data || !data.length) {
    return <ContentNotFound title="Друзья не найдены" />
  }
  
  const searchQuery = ctx.spy(friendsSortAtom).searchQuery

  const filteredfriends = searchQuery && searchQuery.length > 0
    ? filterFriendsByNickname(data, searchQuery)
    : data;

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
}, "ProfileFriendsList")

export const ProfileFriends = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <ProfileFriendsFiltering />
      <ProfileFriendsList />
    </div>
  );
}