// import { useQuery } from "@tanstack/react-query";
// import { PostEntity } from "@repo/types/entities/entities-type";

// type GetPostsComments = Pick<PostEntity, "id"> &
//   Partial<{
//     order: "created_at" | "rating";
//     limit: number;
//     range: number[];
//     ascending: boolean;
//   }>;

// type PostCommentsQuery = GetPostsComments & {
//   comments: boolean;
// };

// export const postCommentsQuery = ({
//   id,
//   comments = true,
//   range,
//   limit,
//   order,
//   ascending,
// }: PostCommentsQuery) => useQuery({
//   queryKey: POST_COMMENTS_QUERY_KEY(id),
//   queryFn: () => [],
//   refetchOnWindowFocus: false,
//   refetchOnMount: false,
//   enabled: comments && !!id,
// });