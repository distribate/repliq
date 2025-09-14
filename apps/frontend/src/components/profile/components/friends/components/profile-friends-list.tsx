import { ContentNotFound } from "#components/templates/components/content-not-found";
import { SomethingError } from "#components/templates/components/something-error";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { UserNickname } from "#components/user/components/name/nickname";
import { UserDonate } from "#components/user/components/donate/components/donate";
import { UserCardModal } from "#components/modals/custom/user-card-modal";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";
import { isExistAtom, profileFriendsAction, profileFriendsDataAtom } from "../models/profile-friends.model";
import { CustomLink } from "#shared/components/link";
import { createIdLink } from "#shared/helpers/create-link";
import { AtomState } from "@reatom/core";

type Friend = NonNullable<AtomState<typeof profileFriendsDataAtom>>[number]

const FriendProfileCard = ({ nickname, name_color, avatar, is_donate, description }: Friend) => {
  return (
    <div className="flex gap-2 items-center w-full bg-shark-950 py-4 px-4 rounded-lg">
      <CustomLink
        to={createIdLink("user", nickname)}
        className='aspect-square h-16 max-h-16 min-h-16'
      >
        <Avatar
          url={avatar}
          propHeight={64}
          propWidth={64}
          nickname={nickname}
          className="aspect-square h-16 max-h-16 min-h-16"
        />
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
                className="text-lg cursor-pointer leading-3 text-shark-50"
              />
            }
          />
          {is_donate && <UserDonate />}
        </div>
        {description && (
          <Typography className="text-shark-300 truncate">
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
};

export const ProfileFriendsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(profileFriendsDataAtom)

  if (ctx.spy(profileFriendsAction.statusesAtom).isPending) {
    return <SectionSkeleton />;
  }

  if (ctx.spy(profileFriendsAction.statusesAtom).isRejected) {
    return <SomethingError />;
  }

  const isExist = ctx.spy(isExistAtom)

  if (!data || !isExist) {
    return <ContentNotFound title="Друзья не найдены" />
  }

  return (
    <div className="grid auto-rows-auto grid-cols-1 lg:grid-cols-3 gap-2 w-full">
      {data.map(friend => <FriendProfileCard key={friend.nickname} {...friend} />)}
    </div>
  );
}, "ProfileFriendsList")