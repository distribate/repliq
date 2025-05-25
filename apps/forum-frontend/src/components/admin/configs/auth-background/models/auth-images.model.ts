import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { forumAdminClient } from "@repo/shared/api/forum-client";
import { createAuthImageSchema } from "@repo/types/schemas/admin/create-auth-image-schema";
import ky from "ky";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "@tanstack/react-router";
import { sleep } from "@reatom/framework";

type AuthImages = {
  name: string;
  url: string;
};

async function getAuthBackgroundImages() {
  const res = await forumAdminClient.admin["get-auth-images"].$get();
  const data = await res.json();

  if ("error" in data) return null;

  return data.data;
}

export const authImagesAtom = atom<AuthImages[] | null>(null, "authImagesAtom")

export const authImagesAction = reatomAsync(async (ctx) => {
  const authBackgroundImages = await getAuthBackgroundImages();

  if (!authBackgroundImages) return null

  let images: Array<AuthImages> = [];

  for (let i = 0; i < authBackgroundImages.length; i++) {
    const name = authBackgroundImages[i]?.name;

    const image = {
      url: "asd",
      name: "asd"
    }

    // @ts-ignore
    images.push({ name, url: image });
  }

  if (images.length === 0) return null;

  authImagesAtom(ctx, images)
})

async function createAuthImage({
  files
}: z.infer<typeof createAuthImageSchema>) {
  const url = forumAdminClient.admin["create-auth-image"].$url()

  const res = await ky.post(url, {
    json: {
      files
    }
  })

  if (!res.ok) {
    return "no-data"
  }

  return await res.json()
}

export const createAuthImageAction = reatomAsync(async (_, files: FileList) => {
  const convertedFiles = Array.from(files).slice(0, 3);

  await sleep(2000)

  return await createAuthImage({ files: convertedFiles })
}, {
  name: "createAuthImageAction",
  onFulfill: (_, res) => {
    if (!res) {
      toast.error("Произошла ошибка при загрузке изображения");
      return;
    }

    toast.success("Изображение загружено");

    return useRouter().invalidate();
  }
}).pipe(withStatusesAtom())