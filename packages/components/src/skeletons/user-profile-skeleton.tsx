import { UserCoverSkeleton } from "../profile/components/cover/cover/components/cover-skeleton.tsx";
import { UserContentSkeleton } from "./user-content-skeleton.tsx";

export const UserProfileSkeleton = () => {
	return (
		<div className="flex flex-col w-full relative pb-12">
			<UserCoverSkeleton/>
			<UserContentSkeleton/>
		</div>
	)
}