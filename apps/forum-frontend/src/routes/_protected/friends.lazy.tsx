import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import { Separator } from '@repo/ui/src/components/separator'
import { createLazyFileRoute } from '@tanstack/react-router'
import {
  FriendsAllCountIndicator,
  FriendsIncomingRequestsIndicator,
  FriendsOutgoingRequstsIndicator,
} from '@repo/components/src/friends/components/control/components/friends-indicators'
import { FriendsList } from '@repo/components/src/friends/components/lists/friends-list'
import { FriendsTab } from '@repo/components/src/friends/components/control/components/friends-tab'
// import { FriendsStatistics } from '@repo/components/src/friends/components/statistics/friends-statistics'

export const Route = createLazyFileRoute('/_protected/friends')({
  component: RouteComponent,
  // @ts-ignore
  head: () => {
    return {
      meta: [
        {
          title: 'Друзья',
        },
      ],
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-dvh gap-2 items-start lg:flex-row w-full relative">
      <BlockWrapper className="lg:order-first order-last flex w-full lg:w-4/6 *:w-full !p-4 min-h-dvh">
        <FriendsList />
      </BlockWrapper>
      <div className="flex lg:order-last order-first flex-col gap-4 w-full lg:w-2/6 sticky top-0 h-fit">
        <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
          <FriendsTab type="all" title="Мои друзья">
            <FriendsAllCountIndicator />
          </FriendsTab>
          <FriendsTab type="incoming" title="Входящие заявки">
            <FriendsIncomingRequestsIndicator />
          </FriendsTab>
          <FriendsTab type="outgoing" title="Исходящие заявки">
            <FriendsOutgoingRequstsIndicator />
          </FriendsTab>
          <Separator />
          <FriendsTab type="search" title="Поиск друзей" />
        </BlockWrapper>
        {/*<FriendsStatistics />*/}
      </div>
    </div>
  )
}
