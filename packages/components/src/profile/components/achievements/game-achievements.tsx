import { UserPageParam } from "@repo/types/config/page-types.ts"
import { ProfileSectionLayout } from '../../../layouts/profile-section-layout.tsx';

export const UserProfileGameAchievements = async({
	nickname
}: UserPageParam) => {
	return (
		<ProfileSectionLayout>
			Achievements
		</ProfileSectionLayout>
	)
}