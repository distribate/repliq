import { ProfileWrapper } from '#ui/profile-wrapper';
import { onConnect } from '@reatom/framework';
import { ProfileThreadsFiltering } from './profile-threads-filtering';
import { profileThreadsAction, ProfileThreadsViewer } from '../models/profile-threads.model';
import { ProfileThreadsList } from './profile-threads-list';

onConnect(profileThreadsAction, profileThreadsAction)

export const UserProfileThreads = () => {
  return (
    <ProfileWrapper>
      <div className="flex flex-col gap-4 w-full h-full">
        <ProfileThreadsFiltering />
        <div className="flex flex-col w-full h-full">
          <ProfileThreadsList />
          <ProfileThreadsViewer />
        </div>
      </div>
    </ProfileWrapper>
  )
};