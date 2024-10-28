import { ProfileSectionLayout } from '../../../layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';

export const UserProfileGameAchievements = async({
	nickname
}: UserPageParam) => {
	return (
		<ProfileSectionLayout>
			Achievements
		</ProfileSectionLayout>
	)
}