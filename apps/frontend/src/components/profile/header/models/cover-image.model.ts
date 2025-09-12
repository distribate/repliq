import * as z from "zod";
import { reatomAsync, reatomResource, withCache, withDataAtom, withStatusesAtom } from '@reatom/async';
import { toast } from "sonner";
import { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema.ts"
import { requestedUserCoverImageAtom } from "#components/profile/main/models/requested-user.model";
import { sharedClient, userClient } from "#shared/api/forum-client"
import { encode } from "cbor-x"
import { currentUserAtom } from '#components/user/models/current-user.model';
import { batch } from '@reatom/core';
import type { InferResponseType } from "hono/client"
import ky from 'ky';
import { fileArrayToUint8Array } from "#components/thread/components/thread-create/models/create-thread.model";
import { validateResponse } from "#shared/api/validation";

const inferredClient = userClient.user["cover-image"]["create"].$post

type CreateCoverImage = Omit<z.infer<typeof createCoverImageSchema>, "file"> & {
  file?: File;
}

const url = userClient.user["cover-image"]["create"].$url();

const client = ky.extend({
  headers: { 'Content-Type': 'application/cbor' },
  credentials: "include"
})

async function createCoverImage({ file, type, fileName }: CreateCoverImage) {
  if (type === 'custom') {
    if (!file) throw new Error("File not found")

    const image = await fileArrayToUint8Array([file])
    if (!image) throw new Error("Image not found")

    const structure: z.infer<typeof createCoverImageSchema> = {
      type: "custom",
      file: image[0],
      fileName: file.name
    };

    const encoded = encode(structure);

    const res = await client.post(url, { body: new Uint8Array(encoded) })
    const data = await res.json<InferResponseType<typeof inferredClient>>();

    if ("error" in data) throw new Error(data.error)

    return data
  }

  if (type === 'default') {
    if (!fileName) throw new Error("Filename not found")

    const structure: z.infer<typeof createCoverImageSchema> = {
      type: "default",
      file: undefined,
      fileName
    };

    const encoded = encode(structure);

    const res = await client.post(url, { body: new Uint8Array(encoded) })
    const data = await res.json<InferResponseType<typeof inferredClient>>()

    if ("error" in data) throw new Error(data.error)

    return data
  }

  throw new Error()
}

export const deleteBackgroundImageAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["cover-image"]["remove"].$delete()
    return validateResponse<typeof res>(res);
  })
}, {
  name: "deleteBackgroundImageAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
      toast.error("Произошла ошибка при удалении фона.")
    }
  },
  onFulfill: (ctx, res) => {
    toast.success("Фон удалён");

    batch(ctx, () => {
      requestedUserCoverImageAtom(ctx, null)
      currentUserAtom(ctx, (state) => state ? ({ ...state, cover_image: null }) : null)
    })
  }
}).pipe(withStatusesAtom())

export const uploadBackgroundImageAction = reatomAsync(async (ctx, values: CreateCoverImage) => {
  return await ctx.schedule(() => createCoverImage(values))
}, {
  name: "uploadBackgroundImageAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
      toast.error("Произошла ошибка при обновлении фона.")
    }
  },
  onFulfill: (ctx, res) => {
    toast.success("Фон обновлен");

    const url = res.data.url;

    batch(ctx, () => {
      requestedUserCoverImageAtom(ctx, url)
      currentUserAtom(ctx, (state) => state ? ({ ...state, cover_image: url }) : null)
    })
  }
}).pipe(withStatusesAtom())

export const imagesLibraryAction = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await sharedClient.shared["library"]["images"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    );

    return validateResponse<typeof res>(res);
  })
}, "imagesLibraryAction").pipe(withDataAtom(), withStatusesAtom(), withCache())