import { createThreadComment as create } from "./create-thread-comment.ts";
import { replyThreadComment as reply } from "./reply-thread-comment.ts";

type ThreadComment = {
  thread_id: string;
  content: string;
}

type CreateThreadComment = ThreadComment

type ReplyThreadComment = ThreadComment & {
  recipient_comment_id: number;
}

export async function replyThreadComment({
  recipient_comment_id, content, thread_id
}: ReplyThreadComment) {
  return await reply({ content, threadId: thread_id, recipient_comment_id: recipient_comment_id.toString() });
}

export async function createThreadComment({
  thread_id, content
}: CreateThreadComment) {
  return await create({ content, threadId: thread_id });
}