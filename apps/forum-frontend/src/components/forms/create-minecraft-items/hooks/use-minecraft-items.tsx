import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router"
import { forumAdminClient } from "@repo/shared/api/forum-client.ts";
import ky from "ky";
import { createMinecraftItemSchema } from "@repo/types/schemas/admin/create-minecraft-item-schema.ts";
import { z } from "zod";

export const MINECRAFT_CREATE_ITEM_MUTATION_KEY = ["minecraft-item-create"];
export const MINECRAFT_DELETE_ITEM_MUTATION_KEY = ["minecraft-item-delete"];

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

export const useMinecraftItems = () => {
  const { invalidate } = useRouter();

  const createMinecraftItemMutation = useMutation({
    mutationKey: MINECRAFT_CREATE_ITEM_MUTATION_KEY,
    mutationFn: async (values: CreateMinecraftItemMutation) => createMinecraftItem({
      file: values.image,
      meta: { name: values.title, description: values.description }
    }),
    onSuccess: async (data, variables, context) => {
      if (!data) return toast.error("Произошла ошибка при создании предмета");

      toast.success("Предмет создан");

      return invalidate();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const deleteMinecraftItemMutation = useMutation({
    mutationKey: MINECRAFT_DELETE_ITEM_MUTATION_KEY,
    mutationFn: async () => null,
    onSuccess: async (data, variables, context) => {
      if (!data) return toast.error("Произошла ошибка при удалении предмета");

      return invalidate();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { createMinecraftItemMutation, deleteMinecraftItemMutation };
};