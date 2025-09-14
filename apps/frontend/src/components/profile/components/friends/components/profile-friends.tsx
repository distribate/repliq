import { ProfileWrapper } from "#ui/profile-wrapper";
import { onConnect } from '@reatom/framework';
import { profileFriendsAction, ProfileFriendsViewer } from '../models/profile-friends.model';
import { ProfileFriendsList } from "./profile-friends-list";
import { ProfileFriendsFiltering } from "./profile-friends-filtering";
import { reatomComponent } from "@reatom/npm-react";
import { Typography } from "@repo/ui/src/components/typography";
import { requestedUserParamAtom } from "#components/profile/models/requested-user.model";

onConnect(profileFriendsAction, profileFriendsAction)

export const UserProfileFriends = reatomComponent(({ ctx }) => {
  const nickname = ctx.spy(requestedUserParamAtom)
  if (!nickname) return;

  return (
    <ProfileWrapper>
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="flex w-full gap-2 justify-between items-center">
          <div className="flex flex-1 min-w-0 truncate items-center">
            <Typography textColor="shark_white" textSize="big" className="font-semibold">
              Друзья {nickname}
            </Typography>
          </div>
          <ProfileFriendsFiltering />
        </div>
        <div className="flex flex-col w-full h-full">
          <ProfileFriendsList />
          <ProfileFriendsViewer />
        </div>
      </div>
    </ProfileWrapper>
  );
})