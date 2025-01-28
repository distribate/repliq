import { createFileRoute } from '@tanstack/react-router'
import { UserCoverLayout } from '@repo/components/src/profile/components/cover/components/cover-layout.tsx'
import { ProfileContent } from "@repo/components/src/profile/components/profile-content/components/profile-content.tsx";

export const Route = createFileRoute('/_protected/user/$nickname')({
  component: RouteComponent,
  head: ({ params: { nickname } }) => ({
    meta: [
      {
        title: nickname,
        description: `Профиль игрока ${nickname}`,
        keywords: [nickname ?? "player", `fasberry profile player`, `${nickname} profile`,],
      }
    ]
  })
})

function RouteComponent() {
  const { nickname } = Route.useParams()

  return (
    <div className="flex flex-col gap-6 w-full h-full relative">
      <UserCoverLayout nickname={nickname}>
        <ProfileContent nickname={nickname} />
      </UserCoverLayout>
    </div>
  )
}