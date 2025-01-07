import { ThreadControlQueryValues } from "#thread/components/thread-control/queries/thread-control-query.ts";
import { forumThreadClient } from "@repo/shared/api/forum-client";

type UpdateThread = {
  threadId: string;
  values: ThreadControlQueryValues;
};

export async function updateThread({ threadId, values }: UpdateThread) {
  const { description, title, content, is_comments } = values;

  const res = await forumThreadClient.thread["update-thread-settings"].$post({
    json: {
      threadId,
      new_description: description,
      new_title: title,
      new_tags: undefined,
      is_comments: is_comments.toString(),
    },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null
  }

  return data;
}