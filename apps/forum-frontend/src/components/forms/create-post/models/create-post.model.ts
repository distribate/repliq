import { toast } from "sonner";
import { postFormFieldAtom } from "./post-form.model.ts";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user.ts";
import { PostEntity } from "@repo/types/entities/entities-type.ts";
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';
import { reatomAsync, withErrorAtom, withStatusesAtom } from "@reatom/async";
import { postsDataAtom } from "#components/profile/posts/posts/models/posts.model.ts";
import { forumPostClient } from "@repo/shared/api/forum-client";
import { VisibilityPost } from "../models/post-form.model.ts";

export const outputValidator = (
  output: string,
  bannedWords: string[],
): string => {
  const censorWord = (word: string) => word.length > 2
    ? word[0] + "*".repeat(word.length - 2) + word[word.length - 1]
    : "*".repeat(word.length);

  const bannedPattern = new RegExp(`\\b(${bannedWords.join("|")})\\b`, "giu");

  return output.replace(bannedPattern, (match) => censorWord(match));
};

export const bannedWords = ["FUCK", "fuck", "сука", "бля"];

type VisibilityOption = {
  label: string;
  value: VisibilityPost;
};

export const visibilityProperties: VisibilityOption[] = [
  {
    label: "Видно всем",
    value: "all",
  },
  {
    label: "Видно только мне",
    value: "only",
  },
  {
    label: "Только друзьям",
    value: "friends",
  },
];

async function createPost({
  content, isComments, isPinned, visibility
}: {
  content: string, isComments: boolean, isPinned: boolean, visibility: "only" | "all" | "friends"
}) {
  const res = await forumPostClient.post["create-post"].$post({
    json: { content, isComments, isPinned, visibility }
  })

  const data = await res.json();

  if ("error" in data) return null

  return data;
}

export const createPostAction = reatomAsync(async (_, { content, visibility }: Pick<PostEntity, "visibility"> & { content: string | null }) => {
  if (!content) return;
  
  const fixedContent = outputValidator(content, bannedWords);

  return await createPost({ isComments: false, isPinned: false, content: fixedContent, visibility });
}, {
  name: "createPostAction",
  onFulfill: (ctx, res) => {
    if (!res) {
      return toast.error("Произошла ошибка при публикации поста. Попробуйте позже!", {
        description: "Попробуйте попытку позже",
      });
    }

    const nickname = ctx.get(currentUserNicknameAtom)
    if (!nickname) return;

    toast.success("Опубликовано");

    const newPost: Pick<GetUserPostsResponse, "data">["data"][0] = {
      ...res.data,
      nickname,
      views_count: 0,
      isViewed: true,
      comments_count: 0,
    };

    postsDataAtom(ctx, (state) => state ? [newPost, ...state] : null)

    postFormFieldAtom.reset(ctx)
  },
  onReject: (_, error) => {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}).pipe(withStatusesAtom(), withErrorAtom())