import { getImageUrl } from "@repo/lib/helpers/get-image-from-bucket.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { REQUESTED_USER_QUERY_KEY } from "@repo/lib/queries/requested-user-query.ts";
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets"
import { USER } from "@repo/types/entities/entities-type.ts";

export const IMAGE_COVER_QUERY_KEY = (nickname: string) => {
	return [ "user", "cover", nickname ]
}

type CoverImageQuery = {
	nickname: string
}

export const imageCoverQuery = ({
	nickname
}: CoverImageQuery) => {
	const qc = useQueryClient();
	
	const requestedUser = qc.getQueryData<USER>(
		REQUESTED_USER_QUERY_KEY(nickname)
	);
	
	const fileName = typeof requestedUser !== 'string'
		? requestedUser
			? requestedUser.cover_image
			: null
		: null;
	
	return useQuery({
		queryKey: IMAGE_COVER_QUERY_KEY(nickname),
		queryFn: () => getImageUrl({
			bucket: USER_IMAGES_BUCKET, fileName: fileName
		}),
		enabled: !!nickname && !!requestedUser,
		refetchOnWindowFocus: false
	})
}