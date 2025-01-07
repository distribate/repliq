"use server";

import "server-only";
import { ThreadEntity } from "@repo/types/entities/entities-type";
import { createClient } from "@repo/shared/api/supabase-client.ts";
import { PostThreadImages, postThreadImages } from "./post-thread-images.ts";
import { postThreadTags } from "#forms/create-thread/queries/post-thread-tags.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type PostThreadProperties = Omit<ThreadEntity, "content"> &
  Partial<
    {
      category_id: number;
      content: string;
      tags: string[]
      id: string;
    } 
  >;

export type PostThreadType = Nullable<Pick<PostThreadImages, "base64Files">> &
  Omit<
    PostThreadProperties,
    "thread_id" | "created_at" | "id" | "updated_at" | "is_updated"
  >;

export async function postThreadCategory({
  id: thread_id,
  category_id,
}: Pick<PostThreadProperties, "id" | "category_id">) {
  const api = createClient();

  const { data, error } = await api
    .from("category_threads")
    .insert({ category_id, thread_id })
    .select("thread_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as { thread_id: string };
}

export async function postThreadNickname(
  thread_id: Pick<PostThreadProperties, "id">["id"],
) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const api = createClient();

  const { data, error } = await api
    .from("threads_users")
    .insert({ thread_id, user_nickname: currentUser.nickname })
    .select("thread_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function postThreadItem({
  ...values
}: Partial<Omit<ThreadEntity, "id" | "created_at">>) {
  const api = createClient();

  const {
    is_comments,
    content,
    permission,
    description,
    title,
    visibility,
  } = values;

  const { data, error } = await api
    .from("threads")
    .insert({
      title,
      description,
      content,
      is_comments,
      permission,
      visibility,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Pick<ThreadEntity, "id">;
}

export async function postThread({ ...values }: PostThreadType) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const {
    category_id,
    content: rawContent,
    is_comments,
    title,
    tags,
    visibility,
    permission,
    description,
    base64Files,
  } = values;

  if (!rawContent || !title) return;

  const content = JSON.parse(rawContent);

  const { id: thread_id } = await postThreadItem({
    content,
    is_comments,
    title,
    description,
    permission,
    visibility,
  });

  if (base64Files) await postThreadImages({ thread_id, base64Files });

  await postThreadNickname(thread_id);
  await postThreadCategory({ id: thread_id, category_id });
  await postThreadTags({ id: thread_id, tags });

  return thread_id;
}
