import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { UserCoverSkeleton } from '@repo/components/src/skeletons/user-cover-skeleton.tsx'
import { UserCoverLayout } from '@repo/components/src/profile/components/cover/components/cover-layout.tsx'
import { ProfileContent } from "@repo/components/src/profile/components/profile-content/components/profile-content.tsx";

export const Route = createFileRoute('/_protected/user/$nickname')({
  component: RouteComponent,
  head: ({ params: { nickname } }) => ({
    meta: [
      {
        title: nickname
      }
    ]
  })
})

function RouteComponent() {
  const { nickname } = Route.useParams()

  return (
    <div className="flex flex-col gap-6 w-full h-full relative">
      <Suspense fallback={<UserCoverSkeleton />}>
        <UserCoverLayout requestedUserNickname={nickname}>
          <ProfileContent requestedUserNickname={nickname} />
        </UserCoverLayout>
      </Suspense>
    </div>
  )
}