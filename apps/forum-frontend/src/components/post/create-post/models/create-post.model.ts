import { toast } from "sonner";
import { currentUserAtom } from "#components/user/models/current-user.model.ts";
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';
import { reatomAsync, withErrorAtom, withStatusesAtom } from "@reatom/async";
import { forumPostClient } from "#shared/forum-client";
import { postContentSchema, postFormContentAtom, postFormResetAction, postFormVisibilityAtom, VisibilityPost } from "./post-form.model.ts";
import * as z from "zod";
import { postsDataAtom } from "#components/profile/posts/models/posts.model.ts";
import { batch } from "@reatom/core";

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

  if ("error" in data) throw new Error(data.error)

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

  if (!content) {
    throw new Error("Content not found")
  }

  const fixedContent = sanitizeInput(content);

  const result = postSchema.safeParse({ content: fixedContent, visibility });

  if (!result.success) {
    throw new Error("Validation error")
  }

  return await createPost({ isComments: false, isPinned: false, content: fixedContent, visibility });
}, {
  name: "createPostAction",
  onFulfill: (ctx, res) => {
    const user = ctx.get(currentUserAtom)
    if (!user) return;

    const newPost: Pick<GetUserPostsResponse, "data">["data"][0] = {
      ...res.data,
      avatar: user.avatar,
      nickname: user.nickname,
      views_count: 1,
      isViewed: true,
      comments_count: 0
    };

    batch(ctx, () => {
      postFormResetAction(ctx);

      postsDataAtom(ctx, (state) => {
        if (!state) state = [];

        return [newPost, ...state]
      })
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message);

      toast.error("Произошла ошибка при публикации поста. Попробуйте позже!", {
        description: "Попробуйте попытку позже",
      });
    }
  }
}).pipe(withStatusesAtom(), withErrorAtom())