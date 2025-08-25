import {
  FriendsAllCountIndicator,
  FriendsIncomingRequestsIndicator,
  FriendsOutgoingRequstsIndicator,
} from '#components/friends/components/control/components/friends-indicators'
import { FriendsListContent } from '#components/friends/components/lists/components/friends-list'
import { FriendsTab } from '#components/friends/components/control/components/friends-tab'
import { onConnect, onDisconnect } from '@reatom/framework'
import { FriendsFilteringSearch } from '#components/friends/components/filtering/components/friends-filtering-search'
import { friendsCountAction } from '#components/friends/models/friends-count.model'
import { reatomComponent } from '@reatom/npm-react'
import { navigationVariant } from '#components/collection/components/navigation/collection-navigation'
import { NavigationBadge } from '#ui/navigation-badge'
import { friendsListTypeAtom } from '#components/friends/components/filtering/models/friends-filtering.model'
import { ReactNode } from 'react'

onConnect(friendsCountAction.dataAtom, friendsCountAction)
onDisconnect(friendsCountAction.dataAtom, (ctx) => friendsCountAction.dataAtom.reset(ctx))

const NAVIGATION = [
  { title: "Мои друзья", value: "all" },
  { title: "Входящие заявки", value: "incoming" },
  { title: "Исходящие заявки", value: "outgoing" },
] as const;

const NavigationItem = reatomComponent<{ navigation: typeof NAVIGATION[number] }>(({ navigation, ctx }) => {
  const friendsFilteringState = ctx.spy(friendsListTypeAtom)
  const isActive = navigation.value === friendsFilteringState ? "active" : "inactive";

  const handle = () => {
    friendsListTypeAtom(ctx, navigation.value)
  }

  return (
    <NavigationBadge
      title={navigation.title}
      data-state={isActive}
      onClick={handle}
      className="gap-2"
    >
      {COMPONENTS[navigation.value]}
    </NavigationBadge>
  )
}, "NavigationItem")

const COMPONENTS: Record<string, ReactNode> = {
  "all": <FriendsAllCountIndicator />,
  "incoming": < FriendsIncomingRequestsIndicator />,
  "outgoing": <FriendsOutgoingRequstsIndicator />
} as const;

const FriendsNavigation = () => {
  return (
    <div className={navigationVariant()}>
      {NAVIGATION.map((navigation) => (
        <NavigationItem key={navigation.value} navigation={navigation} />
      ))}
    </div>
  )
}

export default function FriendsRouteComponent() {
  return (
    <div className="flex flex-col gap-4 items-start lg:flex-row w-full relative">
      <div className="flex flex-col gap-2 lg:w-4/6 h-full bg-primary-color rounded-xl p-2 sm:p-4 w-full">
        <FriendsNavigation />
        <div className="flex items-center justify-end gap-4 w-full">
          <FriendsFilteringSearch />
        </div>
        <div className="flex w-full mt-2 h-auto">
          <FriendsListContent />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full lg:w-2/6 sticky top-0 h-fit bg-primary-color rounded-xl p-4">
        <FriendsTab type="search" title="Поиск друзей" />
      </div>
    </div>
  )
}