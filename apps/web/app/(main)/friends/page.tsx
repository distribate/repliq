import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { REQUESTS_INCOMING_QUERY_KEY } from "@repo/components/src/friends/queries/requests-incoming-query.ts";
import { REQUESTS_OUTGOING_QUERY_KEY } from "@repo/components/src/friends/queries/requests-outgoing-query.ts";
import { FriendsFilteringView } from "@repo/components/src/friends/components/filtering/components/friends-filtering-view.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { FriendsTab } from "@repo/components/src/friends/components/control/components/friends-tab.tsx";
import { getRequestsByType } from "@repo/components/src/friends/queries/get-requests-by-type.ts";
import { BlockWrapper } from "@repo/components/src/wrappers/block-wrapper.tsx";
import {
  FriendsAllCountIndicator,
  FriendsIncomingRequestsIndicator,
  FriendsOutgoingRequstsIndicator,
} from "@repo/components/src/friends/components/control/components/friends-indicators.tsx";
import { FriendsList } from "@repo/components/src/friends/components/lists/friends-list.tsx";
import { Metadata } from "next";
import { FilteringSearchWrapper } from "@repo/components/src/wrappers/filtering-search-wrapper.tsx";
import dynamic from "next/dynamic";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";

export const metadata: Metadata = {
  title: "Друзья",
};

const FriendsFilteringSearch = dynamic(() =>
  import(
    "@repo/components/src/friends/components/filtering/components/friends-filtering-search.tsx"
  ).then((m) => m.FriendsFilteringSearch),
);

export default async function FriendsPage() {
  const { user, session } = await getCurrentSession();
  if (!user || !session) return null;

  const { nickname } = user;

  const qc = new QueryClient();

  await Promise.all([
    qc.prefetchQuery({
      queryKey: REQUESTS_INCOMING_QUERY_KEY(nickname),
      queryFn: () => getRequestsByType({ type: "incoming", nickname }),
    }),
    qc.prefetchQuery({
      queryKey: REQUESTS_OUTGOING_QUERY_KEY(nickname),
      queryFn: () => getRequestsByType({ type: "outgoing", nickname }),
    }),
  ]);

  const dehydratedClient = dehydrate(qc);

  return (
    <div className="flex flex-col gap-2 items-start lg:flex-row w-full h-full relative">
      <HydrationBoundary state={dehydratedClient}>
        <BlockWrapper className="flex w-4/6 *:w-full !p-4 h-full">
          <div className="flex flex-col w-full h-full gap-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-1 w-fit">
                <Typography
                  textColor="shark_white"
                  className="text-[22px] font-semibold"
                >
                  Ваши друзья
                </Typography>
              </div>
              <div className="flex items-center gap-4 w-fit">
                <FilteringSearchWrapper>
                  <FriendsFilteringSearch />
                </FilteringSearchWrapper>
                <FriendsFilteringView />
              </div>
            </div>
            <FriendsList nickname={nickname} />
          </div>
        </BlockWrapper>
        <div className="flex flex-col gap-4 w-2/6 sticky top-0 h-fit">
          <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
            <FriendsTab type="all" title="Мои друзья">
              <FriendsAllCountIndicator nickname={nickname} />
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
      </HydrationBoundary>
    </div>
  );
}
