import { Metadata } from "next";
import { MetadataType, PageConventionProps } from "@repo/types/global";
import { Thread } from "@repo/components/src/thread/components/thread-main/components/thread-main.tsx";
import { createClient } from "@repo/shared/api/supabase-client";

async function getThreadTitle(threadId: string) {
  const api = createClient()

  const { data, error } = await api
    .from("threads")
    .select("title, description")
    .eq("id", threadId)
    .single()

  if (error) {
    return null;
  }

  return {
    title: data.title,
    description: data?.description ?? null
  }
}

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { id: thread_id } = params;

  let title: string = "Загрузка...";
  let description: string | null = null;

  if (!thread_id) {
    return { title };
  }

  const data = await getThreadTitle(thread_id);

  if (!data?.title) {
    title = "Не найдено";
  } else {
    title = data.title.slice(0, 40).concat("...")
  }

  if (data && !data?.description) {
    description = title;
  } else if (data && data?.description?.length > 160) {
    description = data.description.slice(0, 160).concat("...");
  } else {
    description = data?.description;
  }

  return {
    title,
    description
  };
}

export default async function ThreadPage({
  params
}: PageConventionProps) {
  const { id: threadId } = params;

  return (
    <div className="flex gap-2 items-start h-full w-full relative">
      <Thread threadId={threadId} />
    </div>
  );
}