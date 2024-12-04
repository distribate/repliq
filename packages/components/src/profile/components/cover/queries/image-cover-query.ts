import { getImageUrl } from "@repo/lib/helpers/get-image-from-bucket.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { REQUESTED_USER_QUERY_KEY } from "#profile/components/cover/queries/requested-user-query.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const IMAGE_COVER_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["cover"], nickname);

export const imageCoverQuery = (nickname: string) => {
  const qc = useQueryClient();

  const requestedUser = qc.getQueryData<UserEntity>(
    REQUESTED_USER_QUERY_KEY(nickname),
  );

  const fileName =
    typeof requestedUser !== "string"
      ? requestedUser
        ? requestedUser.cover_image
        : null
      : null;

  return useQuery({
    queryKey: IMAGE_COVER_QUERY_KEY(nickname),
    queryFn: () =>
      getImageUrl({
        bucket: USER_IMAGES_BUCKET,
        fileName: fileName,
      }),
    enabled: !!nickname && !!requestedUser,
    refetchOnWindowFocus: false,
  });
};
