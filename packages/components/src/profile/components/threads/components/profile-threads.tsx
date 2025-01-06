"use client"

import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { ProfileThreads } from '#profile/components/threads/components/profile-threads-list.tsx';
import { THREADS_QUERY_KEY } from '#profile/components/threads/queries/profile-threads-query.ts';
import { getThreadsUser } from '#profile/components/threads/queries/get-threads-user.ts';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { ProfileThreadsSkeleton } from '#profile/components/threads/components/profile-threads-skeleton.tsx';
import { Suspense } from 'react';

export const UserProfileThreads = ({ nickname }: UserPageParam) => {
  const qc = new QueryClient();
  
  qc.prefetchQuery({
    queryKey: THREADS_QUERY_KEY(nickname),
    queryFn: () => getThreadsUser({ nickname }),
  });
  
  return (
    <Suspense fallback={<ProfileThreadsSkeleton />}>
      <HydrationBoundary state={dehydrate(qc)}>
        <ProfileSectionLayout>
          <ProfileThreads nickname={nickname} />
        </ProfileSectionLayout>
      </HydrationBoundary>
    </Suspense>
  )
};