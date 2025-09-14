import { ProfileWrapper } from '#ui/profile-wrapper';
import { onConnect } from '@reatom/framework';
import { ProfileThreadsFiltering } from './profile-threads-filtering';
import { profileThreadsAction, ProfileThreadsViewer } from '../models/profile-threads.model';
import { ProfileThreadsList } from './profile-threads-list';
import { reatomComponent } from '@reatom/npm-react';
import { requestedUserParamAtom } from '#components/profile/models/requested-user.model';
import { Typography } from '@repo/ui/src/components/typography';

onConnect(profileThreadsAction, profileThreadsAction)

export const UserProfileThreads = reatomComponent(({ ctx }) => {
  const nickname = ctx.spy(requestedUserParamAtom)
  if (!nickname) return null;
  
  return (
    <ProfileWrapper>
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="flex w-full gap-2 justify-between items-center">
          <div className="flex flex-1 min-w-0 truncate items-center">
            <Typography textColor="shark_white" textSize="big" className="font-semibold">
              Треды {nickname}
            </Typography>
          </div>
          <ProfileThreadsFiltering />
        </div>
        <div className="flex flex-col w-full h-full">
          <ProfileThreadsList />
          <ProfileThreadsViewer />
        </div>
      </div>
    </ProfileWrapper>
  )
}, "UserProfileThreads")