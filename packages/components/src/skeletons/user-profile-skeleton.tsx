import { UserCoverSkeleton } from '#skeletons/user-cover-skeleton.tsx';
import { UserContentSkeleton } from '#skeletons/user-content-skeleton.tsx';

export const UserProfileSkeleton = () => {
	return (
		<div className="flex flex-col w-full relative pb-12">
			<UserCoverSkeleton/>
			<UserContentSkeleton/>
		</div>
	)
}