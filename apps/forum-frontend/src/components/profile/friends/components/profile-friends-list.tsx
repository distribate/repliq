import { ContentNotFound } from "#components/templates/components/content-not-found";
import { friendsSortAtom } from "#components/profile/friends/models/friends-sort.model";
// import { ProfileFriendsFiltering } from "#components/profile/friends/components/profile-friends-filtering.tsx";
import { type Friend } from '@repo/types/schemas/friend/friend-types';
import { SomethingError } from "#components/templates/components/something-error";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";
import { Avatar } from "#components/user/avatar/components/avatar";
import { UserNickname } from "#components/user/name/nickname";
import { UserDonate } from "#components/user/donate/components/donate";
import { UserCardModal } from "#components/modals/custom/components/user-card-modal";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";
import { friendsAction, friendsDataAtom } from "../models/profile-friends.model";
import { CustomLink } from "#components/shared/link";
import { createIdLink } from "@repo/lib/utils/create-link";

const filterFriendsByNickname = (data: Friend[], querySearch: string) =>
  data.filter(item => item.nickname.startsWith(querySearch));

const FriendProfileCard = ({ nickname, name_color, avatar,  is_donate, description }: Friend) => {
  return (
    <div className="flex gap-2 items-center w-full bg-shark-950 py-4 px-4 rounded-lg">
      <CustomLink to={createIdLink("user", nickname)}>
        <Avatar url={avatar} propHeight={64} propWidth={64} nickname={nickname} className="min-w-[64px] min-h-[64px]" />
      </CustomLink>
      <div className="flex flex-col gap-1 w-[calc(100%-72px)]">
        <div className="flex items-center gap-1 w-min">
          <UserCardModal
            nickname={nickname}
            withCustomTrigger={true}
            trigger={
              <UserNickname
                nickname={nickname}
                nicknameColor={name_color}
                className="text-[18px] cursor-pointer leading-3 font-medium text-shark-50"
              />
            }
          />
          <UserDonate is_donate={is_donate} />
        </div>
        {description && <p className="text-shark-300 truncate">{description}</p>}
      </div>
    </div>
  );
};

type FilteredNotFoundProps = Partial<{
  value: string;
}>;

const FilteredNotFound = ({ value }: FilteredNotFoundProps) => {
  if (!value) return;

  return <Typography>Ничего не нашлось по запросу {`"${value}"`}</Typography>;
};

const ProfileFriendsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(friendsDataAtom) as Friend[]
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
      {/* <ProfileFriendsFiltering /> */}
      <ProfileFriendsList />
    </div>
  );
}