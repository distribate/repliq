import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { POST_FORM_FIELD_QUERY_KEY } from "../queries/post-form-query.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { PostEntity } from "@repo/types/entities/entities-type.ts";
import { createPost } from "../queries/create-post.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';

type PostsQueryResponse = GetUserPostsResponse

const POSTS_QUERY_KEY = (nickname: string) =>
  createQueryKey('user', ['posts'], nickname);

export const outputValidator = (
  output: string,
  bannedWords: string[],
): string => {
  const censorWord = (word: string) =>
    word.length > 2
      ? word[0] + "*".repeat(word.length - 2) + word[word.length - 1]
      : "*".repeat(word.length);

  const bannedPattern = new RegExp(`\\b(${bannedWords.join("|")})\\b`, "giu");

  return output.replace(bannedPattern, (match) => censorWord(match));
};

export const bannedWords = ["FUCK", "fuck", "сука", "бля"];

export const useCreatePost = () => {
  const qc = useQueryClient();
  const { nickname } = getUser();

  const createPostMutation = useMutation({
    mutationFn: async ({
      content,
      visibility,
    }: Pick<PostEntity, "content" | "visibility">) => {
      const fixedContent = outputValidator(content, bannedWords);

      return createPost({ isComments: false, isPinned: false, content: fixedContent, visibility });
    },
    onSuccess: async (data) => {
      if (!data) return toast.error("Произошла ошибка при публикации поста. Попробуйте позже!", {
        description: "Попробуйте попытку позже",
      });

      toast.success("Опубликовано");

      const newPost: Pick<PostsQueryResponse, "data">["data"][0] = {
        ...data.data,
        nickname,
        views_count: 0,
        isViewed: true,
        comments_count: 0,
      };

      qc.setQueryData(POSTS_QUERY_KEY(nickname), (prev: PostsQueryResponse) => ({
        ...prev,
        data: [newPost, ...prev.data]
      }))
      
      return qc.resetQueries({ queryKey: POST_FORM_FIELD_QUERY_KEY })
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { createPostMutation };
};