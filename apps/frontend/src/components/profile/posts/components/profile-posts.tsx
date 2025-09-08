import { CreatePostSection } from '#components/profile/posts/components/create-post-section';
import { ProfileWrapper } from '#ui/profile-wrapper';
import { reatomComponent } from '@reatom/npm-react';
import { atom, onConnect } from '@reatom/framework';
import { postsAction, ProfilePostsViewer } from '../models/posts.model';
import { userGlobalOptionsAtom } from '#components/user/models/current-user.model';
import { SectionSkeleton } from '#components/templates/components/section-skeleton';
import { ProfilePostsFiltering } from './profile-posts-filtering';
import { ProfilePostsList } from './profile-posts-list';
import { requestedUserIsSameAtom } from '#components/profile/main/models/requested-user.model';

onConnect(postsAction, postsAction);

const createPostSectionIsVisibleAtom = atom((ctx) => {
  return ctx.spy(userGlobalOptionsAtom).can_create_posts && ctx.spy(requestedUserIsSameAtom)
}, "createPostSectionIsVisible")

export const UserProfilePosts = reatomComponent(({ ctx }) => {
  if (ctx.spy(postsAction.statusesAtom).isPending) return <SectionSkeleton />

  const canCreatePosts = ctx.spy(createPostSectionIsVisibleAtom)

  return (
    <ProfileWrapper header={canCreatePosts && <CreatePostSection />}>
      <div className="flex flex-col gap-4 w-full h-full">
        <ProfilePostsFiltering />
        <div className="flex flex-col w-full h-full">
          <ProfilePostsList />
          <ProfilePostsViewer />
        </div>
      </div>
    </ProfileWrapper>
  );
}, "UserProfilePosts")