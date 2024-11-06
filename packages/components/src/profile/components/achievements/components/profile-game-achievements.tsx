import { UserPageParam } from '@repo/types/global';
import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';

export const UserProfileGameAchievements = async({
	nickname
}: UserPageParam) => {
	return (
		<ProfileSectionLayout>
			Achievements
		</ProfileSectionLayout>
	)
}