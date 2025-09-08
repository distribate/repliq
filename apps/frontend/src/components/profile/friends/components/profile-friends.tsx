import { ProfileWrapper } from "#ui/profile-wrapper";
import { onConnect } from '@reatom/framework';
import { profileFriendsAction, ProfileFriendsViewer } from '../models/profile-friends.model';
import { ProfileFriendsList } from "./profile-friends-list";
import { ProfileFriendsFiltering } from "./profile-friends-filtering";

onConnect(profileFriendsAction, profileFriendsAction)

export const UserProfileFriends = () => {
  return (
    <ProfileWrapper>
      <div className="flex flex-col gap-4 w-full h-full">
        <ProfileFriendsFiltering />
        <div className="flex flex-col w-full h-full">
          <ProfileFriendsList />
          <ProfileFriendsViewer />
        </div>
      </div>
    </ProfileWrapper>
  );
};