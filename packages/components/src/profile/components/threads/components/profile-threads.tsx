import { ProfileSectionLayout } from "#layouts/profile-section-layout.tsx";
import { UserPageParam } from "@repo/types/global";
import { ProfileThreadsList } from "#profile/components/threads/components/profile-threads-list.tsx";
import { THREADS_QUERY_KEY } from "#profile/components/threads/queries/profile-threads-query.ts";
import { getThreadsUser } from "#profile/components/threads/queries/get-threads-user.ts";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

export const UserProfileThreads = async ({ nickname }: UserPageParam) => {
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: THREADS_QUERY_KEY(nickname),
    queryFn: () => getThreadsUser({ nickname }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ProfileSectionLayout>
        <ProfileThreadsList nickname={nickname} />
      </ProfileSectionLayout>
    </HydrationBoundary>
  );
};
