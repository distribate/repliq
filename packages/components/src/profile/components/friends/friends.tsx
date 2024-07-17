import { UserPageParam } from "@repo/types/config/page-types.ts"
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { FriendsList } from "./components/friends-list.tsx";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getFriends } from "./queries/get-friends.ts";
import { getCurrentUser } from "@repo/lib/actions/get-current-user.ts";
import { FriendsIncomingList } from "./components/friends-incoming-list.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs.tsx";
import { FriendsIncomingTrigger } from "./components/friends-incoming-trigger.tsx";
import { FRIENDS_QUERY_KEY } from "./queries/friends-query.ts";
import { FriendsOutgoingTrigger } from "./components/friends-outgoing-trigger.tsx";
import { FriendsOutgoingList } from "./components/friends-outgoing-list.tsx";
import { FriendsTrigger } from "./friends-trigger.tsx";
import { REQUESTS_INCOMING_QUERY_KEY } from "./queries/requests-incoming-query.ts";
import { getIncomingRequests } from "./queries/get-incoming-requests.ts";
import { REQUESTS_OUTGOING_QUERY_KEY } from "./queries/requests-outgoing-query.ts";
import { getOutgoingRequests } from "./queries/get-outgoing-requests.ts";
import { REQUESTS_QUERY_KEY } from "./queries/requests-query.ts";
import { getRequests } from "./queries/get-requests.ts";
import { FriendsFiltering } from "./components/friends-filtering.tsx";
import { protectPrivateArea } from "@repo/lib/helpers/protect-private-area.ts";
import { BlockWrapper } from "../../../wrappers/block-wrapper.tsx";

export const UserFriendsSection = async({
	nickname
}: UserPageParam) => {
	const qc = new QueryClient();
	
	await Promise.all([
		qc.prefetchQuery({
			queryKey: FRIENDS_QUERY_KEY(nickname),
			queryFn: () => getFriends({
				nickname: nickname
			})
		}),
		qc.prefetchQuery({
			queryKey: REQUESTS_INCOMING_QUERY_KEY(nickname),
			queryFn: () => getIncomingRequests(nickname)
		}),
		qc.prefetchQuery({
			queryKey: REQUESTS_QUERY_KEY(nickname),
			queryFn: () => getRequests(nickname),
		}),
		qc.prefetchQuery({
			queryKey: REQUESTS_OUTGOING_QUERY_KEY(nickname),
			queryFn: () => getOutgoingRequests(nickname)
		})
	])
	
	const currentUser = await getCurrentUser()
	
	const isOwner = await protectPrivateArea({
		requestedUserNickname: nickname
	})
	
	if (!currentUser) return null;
	
	return (
		<HydrationBoundary state={dehydrate(qc)}>
			<Tabs defaultValue="friends" className="flex flex-col w-full gap-6">
				<BlockWrapper
					className="flex flex-col gap-y-4"
					backgroundColor="shark_white"
				>
					<TabsList className="flex flex-row justify-start items-center gap-2">
						<TabsTrigger value="friends">
							<div className="flex items-center gap-1">
								Друзья
								<FriendsTrigger nickname={nickname}/>
							</div>
						</TabsTrigger>
						{isOwner && <FriendsIncomingTrigger/>}
						{isOwner && <FriendsOutgoingTrigger/>}
					</TabsList>
					<FriendsFiltering nickname={nickname}/>
				</BlockWrapper>
				<Separator orientation="horizontal"/>
				<TabsContent value="friends">
					<FriendsList nickname={nickname}/>
				</TabsContent>
				{isOwner && <FriendsIncomingList/>}
				{isOwner && <FriendsOutgoingList/>}
			</Tabs>
		</HydrationBoundary>
	)
}