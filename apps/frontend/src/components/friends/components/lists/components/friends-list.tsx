import { friendsListTypeAtom } from "#components/friends/components/filtering/models/friends-filtering.model";
import { FriendsAllList } from "#components/friends/components/lists/components/friends-all-list";
import { reatomComponent } from "@reatom/npm-react";
import { ReactNode } from "react";
import { clientOnly } from "vike-react/clientOnly";

const FriendsOutgoingList = clientOnly(() => import("./friends-outgoing-list").then(m => m.FriendsOutgoingList))
const FriendsIncomingList = clientOnly(() => import("./friends-incoming-list").then(m => m.FriendsIncomingList))
const FriendsRecommendedList = clientOnly(() => import("./friends-recommended-list").then(m => m.FriendsRecommendedList))

const LISTS: Record<string, ReactNode> = {
  "all": <FriendsAllList />,
  "outgoing": <FriendsOutgoingList />,
  "incoming": <FriendsIncomingList />,
  "search": <FriendsRecommendedList />
} as const;

export const FriendsListContent = reatomComponent(({ ctx }) => LISTS[ctx.spy(friendsListTypeAtom)], "FriendsListContent")