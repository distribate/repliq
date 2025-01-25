import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";

export const IMAGE_COVER_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["cover"], nickname);

const getUserCoverImage = async (nickname: string) => {
  const res = await forumUserClient.user["get-user-cover-image"][":nickname"].$get({
    param: {
      nickname,
    }
  });

  const data = await res.json()

  if (!data || 'error' in data) {
    return null
  }

  return data.data;
}

export const imageCoverQuery = (nickname: string) => useQuery({
  queryKey: IMAGE_COVER_QUERY_KEY(nickname),
  queryFn: () => getUserCoverImage(nickname),
  refetchOnWindowFocus: false,
});