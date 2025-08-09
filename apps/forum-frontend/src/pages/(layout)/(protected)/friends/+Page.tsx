import { BlockWrapper } from '#components/wrappers/components/block-wrapper'
import { Separator } from '@repo/ui/src/components/separator'
import {
  FriendsAllCountIndicator,
  FriendsIncomingRequestsIndicator,
  FriendsOutgoingRequstsIndicator,
} from '#components/friends/components/control/components/friends-indicators'
import { FriendsListContent, FriendsListTitle } from '#components/friends/components/lists/components/friends-list'
import { FriendsTab } from '#components/friends/components/control/components/friends-tab'
import { incomingRequestsAction, incomingRequestsAtom, outgoingRequestsAction, outgoingRequestsAtom } from '#components/friends/models/friends-requests.model'
import { onConnect, onDisconnect } from '@reatom/framework'
import { FilteringSearchWrapper } from '#components/wrappers/components/filtering-search-wrapper'
import { FriendsFilteringSearch } from '#components/friends/components/filtering/components/friends-filtering-search'
import { FriendsFilteringView } from '#components/friends/components/filtering/components/friends-filtering-view'
import { friendsCountAction } from '#components/friends/models/friends-count.model'

onConnect(friendsCountAction.dataAtom, friendsCountAction)
onConnect(incomingRequestsAtom, incomingRequestsAction);
onConnect(outgoingRequestsAtom, outgoingRequestsAction);

onDisconnect(friendsCountAction.dataAtom, (ctx) => friendsCountAction.dataAtom.reset(ctx))
onDisconnect(incomingRequestsAtom, (ctx) => incomingRequestsAtom.reset(ctx))
onDisconnect(incomingRequestsAtom, (ctx) => incomingRequestsAtom.reset(ctx))

export default function FriendsRouteComponent() {
  return (
    <div className="flex flex-col min-h-dvh gap-2 items-start lg:flex-row w-full relative">
      <BlockWrapper className="lg:order-first order-last flex w-full lg:w-4/6 *:w-full !p-4 min-h-dvh">
        <div className="flex flex-col w-full h-full gap-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-1 w-fit">
              <FriendsListTitle />
            </div>
            <div className="flex items-center gap-4 w-fit">
              <FilteringSearchWrapper>
                <FriendsFilteringSearch />
              </FilteringSearchWrapper>
              <FriendsFilteringView />
            </div>
          </div>
          <FriendsListContent />
        </div>
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
      </div>
    </div>
  )
}