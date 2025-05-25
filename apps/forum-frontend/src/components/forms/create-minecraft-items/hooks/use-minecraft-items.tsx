import { toast } from "sonner";
import { forumAdminClient } from "@repo/shared/api/forum-client.ts";
import ky from "ky";
import { createMinecraftItemSchema } from "@repo/types/schemas/admin/create-minecraft-item-schema.ts";
import { z } from "zod";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { router } from "#main";

type CreateMinecraftItemMutation = {
  image: File;
} & {
  title: string;
  description: string | null;
}

async function createMinecraftItem({
  file,
  meta,
}: z.infer<typeof createMinecraftItemSchema>) {
  const url = forumAdminClient.admin["create-minecraft-item"].$url()

  const fd = new FormData()

  fd.append("file", file)
  fd.append("meta", JSON.stringify({ name: meta.name, description: meta.description }))

  const res = await ky.post(url, {
    body: fd,
    credentials: "include",
  });

  return await res.json();
}

export const createMinecraftItemAction = reatomAsync(async (ctx, values: CreateMinecraftItemMutation) => {
  return await ctx.schedule(() => createMinecraftItem({
    file: values.image,
    meta: { name: values.title, description: values.description }
  }))
}, {
  name: "createMinecraftItemAction",
  onFulfill: (ctx, res) => {
    if (!res) return toast.error("Произошла ошибка при создании предмета");

    toast.success("Предмет создан");

    ctx.schedule(() => router.invalidate())
  }
}).pipe(withStatusesAtom())