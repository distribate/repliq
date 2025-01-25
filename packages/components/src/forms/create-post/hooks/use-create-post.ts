import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { POSTS_QUERY_KEY } from "#profile/components/posts/components/posts/queries/posts-query.ts";
import { POST_FORM_FIELD_QUERY_KEY } from "../queries/post-form-query.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { PostEntity } from "@repo/types/entities/entities-type.ts";

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
  const currentUser = getUser();

  const createPostMutation = useMutation({
    mutationFn: async ({
      content,
      visibility,
    }: Pick<PostEntity, "content" | "visibility">) => {
      const fixedContent = outputValidator(content, bannedWords);

      // return createPost({ content: fixedContent, visibility });
    },
    onSuccess: async (data) => {
      // if (!data)
      //   toast.error(
      //     "Произошла ошибка при публикации поста. Попробуйте позже!",
      //     {
      //       description: "Попробуйте попытку позже",
      //     },
      //   );

      // toast.success("Опубликовано");

      // await Promise.all([
      //   qc.invalidateQueries({
      //     queryKey: POSTS_QUERY_KEY(currentUser.nickname),
      //   }),
      //   qc.resetQueries({ queryKey: POST_FORM_FIELD_QUERY_KEY }),
      // ]);
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { createPostMutation };
};
