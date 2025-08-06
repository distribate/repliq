import { friendsViewAtom } from "#components/friends/components/filtering/models/friends-filtering.model";
import { FriendsAllList } from "#components/friends/components/lists/components/friends-all-list";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";
import { ReactNode } from "react";
import { lazy, Suspense } from "react";

const FriendsOutgoingList = lazy(() => import("./friends-outgoing-list").then(m => ({ default: m.FriendsOutgoingList })))
const FriendsIncomingList = lazy(() => import("./friends-incoming-list").then(m => ({ default: m.FriendsIncomingList })))
const FriendsRecommendedList = lazy(() => import("./friends-recommended-list").then(m => ({ default: m.FriendsRecommendedList })))

const LISTS: Record<string, ReactNode> = {
  all: <FriendsAllList />,
  outgoing: <FriendsOutgoingList />,
  incoming: <FriendsIncomingList />,
  search: <FriendsRecommendedList />
}

export const FriendsListTitle = reatomComponent(({ ctx }) => {
  const listType = ctx.spy(friendsViewAtom).listType

  return (
    <Typography textColor="shark_white" textSize="very_big" className="font-semibold" >
      {listType !== 'search' ? 'Ваши друзья' : "Поиск друзей"}
    </Typography>
  )
})

export const FriendsListContent = reatomComponent(({ ctx }) => {
  return (
    <Suspense>
      {LISTS[ctx.spy(friendsViewAtom).listType]}
    </Suspense>
  )
})