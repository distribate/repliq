import { TabsContent } from "@repo/ui/src/components/tabs.tsx";
import { UserFriendsSection } from "../../friends/friends.tsx";
import dynamic from "next/dynamic";
import { UserPostsSection } from '../../posts/components/users-posts/components/user-posts-section.tsx';

const UserTopics = dynamic(() =>
	import("@repo/components/src/profile/components/threads/threads.tsx")
	.then(m => m.UserTopics)
)

const UserGameStats = dynamic(() =>
	import("@repo/components/src/profile/components/stats/stats/stats.tsx")
	.then(m => m.UserGameStats)
)

type NavigationTabsContentProps = {
	requestedUserNickname: string,
	requestedUserUuid: string
}

export const NavigationTabsContent = async({
	requestedUserNickname, requestedUserUuid
}: NavigationTabsContentProps) => {
	return (
		<div className="flex grow *:w-full w-full">
			<TabsContent value="posts">
				<UserPostsSection nickname={requestedUserNickname}/>
			</TabsContent>
			<TabsContent value="topics">
				<UserTopics nickname={requestedUserNickname}/>
			</TabsContent>
			<TabsContent value="friends">
				<UserFriendsSection nickname={requestedUserNickname}/>
			</TabsContent>
			<TabsContent value="game-stats">
				<UserGameStats nickname={requestedUserNickname} uuid={requestedUserUuid}/>
			</TabsContent>
			<TabsContent value="account-stats">
				<div className="flex flex-col w-full py-6">Account stats</div>
			</TabsContent>
		</div>
	)
}