import { ProfileFriends } from './profile-friends-list';
import { ProfileWrapper } from "#components/wrappers/components/profile-wrapper";
import { onConnect } from '@reatom/framework';
import { friendsAction } from '../models/profile-friends.model';

onConnect(friendsAction, (ctx) => friendsAction(ctx, { limit: 32 }))

export const UserProfileFriends = () => {
  return (
    <ProfileWrapper>
      <ProfileFriends />
    </ProfileWrapper>
  );
};