
import { reatomAsync, reatomResource, withCache, withDataAtom, withStatusesAtom } from '@reatom/async';
import { toast } from "sonner";
import * as z from "zod";
import { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema.ts"
import { requestedUserCoverImageAtom } from "#components/profile/main/models/requested-user.model";
import { forumSharedClient, forumUserClient } from "#shared/forum-client"
import type { InferResponseType } from "hono/client"
import { encode } from "cbor-x"
import ky from "ky"
import { fileArrayToUint8Array } from "@repo/lib/helpers/file-array-to-uint8-array";
import { currentUserAtom } from '#components/user/models/current-user.model';

const client = forumUserClient.user["create-cover-image"].$post

export type CreateCoverImage = Omit<z.infer<typeof createCoverImageSchema>, "file"> & {
  file?: File;
}

const API = ky.extend({
  credentials: "include",
  headers: {
    'Content-Type': 'application/cbor',
  }
})

export async function createCoverImage({ file, type, fileName }: CreateCoverImage) {
  const url = forumUserClient.user["create-cover-image"].$url();

  switch (type) {
    case "custom":
      if (!file) return;

      const image = await fileArrayToUint8Array([file])
      if (!image) return;

      let customFileStructure: z.infer<typeof createCoverImageSchema> = {
        type: "custom",
        file: image[0],
        fileName: file.name
      };

      const customEncodedData = encode(customFileStructure);

      // @ts-expect-error
      const customRes = await API.post(url, { body: customEncodedData })
      const customData = await customRes.json<InferResponseType<typeof client>>()

      if (!customData || "error" in customData) return null;

      return customData
    case "default":
      if (!fileName) return;

      let defaultStructure: z.infer<typeof createCoverImageSchema> = {
        type: "default",
        file: undefined,
        fileName
      };

      const defaultEncodedData = encode(defaultStructure);

      // @ts-expect-error
      const defaultRes = await API.post(url, { body: defaultEncodedData })
      const defaultData = await defaultRes.json<InferResponseType<typeof client>>()

      if (!defaultData || "error" in defaultData) return null;

      return defaultData
    default:
      break;
  }
}

export async function deleteCoverImage() {
  const res = await forumUserClient.user["delete-cover-image"].$delete()
  const data = await res.json()
  if (!data || "error" in data) return null
  return data
}

export const deleteBackgroundImageAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => deleteCoverImage())
}, {
  name: "deleteBackgroundImageAction",
  onFulfill: (ctx, res) => {
    if (!res) return toast.error("Произошла ошибка при удалении фона.");

    toast.success("Фон удалён");

    requestedUserCoverImageAtom(ctx, null)
    currentUserAtom(ctx, (state) => state ? ({ ...state, cover_image: null }) : null)
  }
}).pipe(withStatusesAtom())

export const uploadBackgroundImageAction = reatomAsync(async (ctx, values: CreateCoverImage) => {
  return await ctx.schedule(() => createCoverImage(values))
}, {
  name: "uploadBackgroundImageAction",
  onFulfill: (ctx, res) => {
    if (!res || !res.data) return toast.error("Произошла ошибка при обновлении фона.")

    toast.success("Фон обновлен");

    requestedUserCoverImageAtom(ctx, res.data)
    currentUserAtom(ctx, (state) => state ? ({ ...state, cover_image: res.data }) : null)
  }
}).pipe(withStatusesAtom())

async function getLibraryImages() {
  const res = await forumSharedClient.shared["get-images-library"].$get();
  const data = await res.json()
  if ('error' in data) return null
  return data.data
}

export const imagesLibraryAction = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getLibraryImages())
}, "imagesLibraryAction").pipe(withDataAtom(), withStatusesAtom(), withCache())