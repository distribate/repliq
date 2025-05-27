import { UserCoverLayout } from '#components/profile/header/components/cover-layout.tsx'
import { Page } from '#components/profile/main/profile-main'

export function UserRouteComponent() {
  return (
    <div className="flex flex-col gap-6 w-full h-full relative">
      <UserCoverLayout>
        <Page />
      </UserCoverLayout>
    </div>
  )
}