import { UserPageParam } from "@repo/types/config/page-types.ts"

export const UserGameAchievements = ({
	nickname
}: UserPageParam) => {
	return (
		<div className="flex flex-col w-full py-6">
			Achievements
		</div>
	)
}