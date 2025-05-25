
import { reatomAsync, reatomResource, withCache, withDataAtom, withStatusesAtom } from '@reatom/async';
import { toast } from "sonner";
import { z } from "zod";
import { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema.ts"
import { requestedUserAtom } from "#components/profile/requested-user.model";
import { forumSharedClient, forumUserClient } from "@repo/shared/api/forum-client"
import { currentUserAtom } from '@repo/lib/helpers/get-user';
import type { InferResponseType } from "hono/client"
import { encode } from "cbor-x"
import ky from "ky"
import { fileArrayToUint8Array } from "@repo/lib/helpers/file-array-to-uint8-array";

const client = forumUserClient.user["create-cover-image"].$post

export type CreateCoverImage = Omit<z.infer<typeof createCoverImageSchema>, "file"> & {
  file?: File;
}

export async function createCoverImage({
  file, type, fileName
}: CreateCoverImage) {
  const url = forumUserClient.user["create-cover-image"].$url();

  switch (type) {
    case "custom":
      if (!file) {
        return;
      }

      const image = await fileArrayToUint8Array([file])

      if (!image) return;

      let customFileStructure: z.infer<typeof createCoverImageSchema> = {
        type: "custom",
        file: image[0],
        fileName: file.name
      };

      const customEncodedData = encode(customFileStructure);

      const customRes = await ky.post(url, {
        body: customEncodedData,
        headers: {
          'Content-Type': 'application/cbor',
        },
        credentials: "include"
      })

      const customData = await customRes.json<InferResponseType<typeof client>>()

      if (!customData || "error" in customData) {
        return null;
      }

      return customData
    case "default":
      if (!fileName) {
        return;
      }

      let defaultStructure: z.infer<typeof createCoverImageSchema> = {
        type: "default",
        file: undefined,
        fileName
      };

      const defaultEncodedData = encode(defaultStructure);

      const defaultRes = await ky.post(url, {
        body: defaultEncodedData,
        headers: {
          'Content-Type': 'application/cbor',
        },
        credentials: "include"
      })

      const defaultData = await defaultRes.json<InferResponseType<typeof client>>()

      if (!defaultData || "error" in defaultData) {
        return null;
      }

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

export type CoverImageInput = z.infer<typeof createCoverImageSchema>;

export const deleteBackgroundImageAction = reatomAsync(async (_) => {
  return await deleteCoverImage()
}, {
  name: "deleteBackgroundImageAction",
  onFulfill: (ctx, res) => {
    if (!res) {
      return toast.error("Произошла ошибка при удалении фона.", {
        description: "Попробуйте попытку позже!",
      });
    }

    toast.success("Фон удалён.");

    currentUserAtom(ctx, (state) => state ? ({ ...state, cover_image: null }) : null)
    requestedUserAtom(ctx, (state) => state ? ({ ...state, cover_image: null, }) : null)
  }
}).pipe(withStatusesAtom())

export const uploadBackgroundImageAction = reatomAsync(async (_, values: CreateCoverImage) => {
  return await createCoverImage(values)
}, {
  name: "uploadBackgroundImageAction",
  onFulfill: (ctx, res) => {
    if (!res || !res.data) return toast.error("Произошла ошибка при обновлении фона.", {
      description: "Попробуйте попытку позже!",
    });

    toast.success("Фон обновлен.");

    currentUserAtom(ctx, (state) => state ? ({ ...state, cover_image: res.data }) : null)
    requestedUserAtom(ctx, (state) => state ? ({ ...state, cover_image: res.data, }) : null)
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