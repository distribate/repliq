import { toast } from "sonner";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user.ts";
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';
import { reatomAsync, withErrorAtom, withStatusesAtom } from "@reatom/async";
import { forumPostClient } from "@repo/shared/api/forum-client";
import { postContentSchema, postFormContentAtom, postFormResetAction, postFormVisibilityAtom, VisibilityPost } from "../models/post-form.model.ts";
import { z } from "zod";
import { postsDataAtom } from "#components/profile/posts/models/posts.model.ts";

type VisibilityOption = {
  label: string;
  value: VisibilityPost;
};

export const visibilityProperties: VisibilityOption[] = [
  { label: "Видно всем", value: "all" },
  { label: "Видно только мне", value: "only" },
  { label: "Только друзьям", value: "friends" },
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

const bannedWords = ["fuck", "shit", "сука", "бля", "идиот", "глупый"];

export const sanitizeInput = (input: string): string => {
  let sanitized = input;

  sanitized = sanitized.replace(/\s{3,}/g, " ");

  const attackPattern =
    /<script.*?>.*?<\/script>|onerror=|onload=|SELECT.*?FROM|DROP TABLE|INSERT INTO|DELETE FROM/gi;
  sanitized = sanitized.replace(attackPattern, "");

  const bannedPattern = new RegExp(
    `(?<!\\w)(${bannedWords.join("|")})(?!\\w)`,
    "giu",
  );
  sanitized = sanitized.replace(bannedPattern, "***");

  return sanitized;
};

export const postSchema = z.object({
  content: postContentSchema,
  visibility: z.enum(["only", "all", "friends"]),
});

export const createPostAction = reatomAsync(async (ctx) => {
  const content = ctx.get(postFormContentAtom);
  const visibility = ctx.get(postFormVisibilityAtom);

  if (!content) return;
  
  const fixedContent = sanitizeInput(content);

  const result = postSchema.safeParse({ content: fixedContent, visibility });

  if (!result.success) {
    toast.error("Validation error");
    return
  }

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

    const newPost: Pick<GetUserPostsResponse, "data">["data"][0] = {
      ...res.data,
      nickname,
      views_count: 0,
      isViewed: true,
      comments_count: 0,
    };

    postFormResetAction(ctx)
    postsDataAtom(ctx, (state) => state ? [newPost, ...state] : null)
  },
  onReject: (_, error) => {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}).pipe(withStatusesAtom(), withErrorAtom())