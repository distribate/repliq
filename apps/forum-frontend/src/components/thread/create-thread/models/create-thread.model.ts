import { toast } from "sonner";
import { THREAD_CONTENT_LIMIT_DEFAULT } from "@repo/shared/constants/limits.ts";
import { blobUrlToFile } from "@repo/lib/helpers/blobUrlToFile.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { forumThreadClient } from "#shared/forum-client";
import { createThreadSchema as initial } from "@repo/types/schemas/thread/create-thread-schema.ts";
import * as z from "zod";
import ky from "ky";
import { encode } from "cbor-x";
import { CreateThreadResponse } from "@repo/types/routes-types/create-thread-types";
import { fileArrayToUint8Array } from "@repo/lib/helpers/file-array-to-uint8-array.ts";
import {
  createThreadFormReset,
  threadFormCategoryAtom,
  threadFormContentAtom,
  threadFormDescriptionAtom,
  threadFormImagesAtom,
  threadFormPermissionAtom,
  threadFormIsCommentAtom,
  threadFormTagsAtom,
  threadFormTitleAtom,
  threadFormVisibilityAtom
} from "./thread-form.model";
import { createIdLink } from "@repo/lib/utils/create-link";
import { atom } from "@reatom/core";
import { navigate } from "vike/client/router";

const createThreadSchemaRequest = initial.omit({ images: true }).extend({
  images: z.array(
    z.instanceof(Uint8Array)
  ).nullable(),
})

const createThreadSchema = createThreadSchemaRequest.extend({
  images: z.array(
    z.instanceof(File)
  ).nullable(),
})

export const contentLimitAtom = atom((ctx) => {
  const images = ctx.spy(threadFormImagesAtom)
  return images && images.length > 0 ? THREAD_CONTENT_LIMIT_DEFAULT[1] : THREAD_CONTENT_LIMIT_DEFAULT[2]
}, "contentLimit")

contentLimitAtom.onChange((_, state) => console.log("contentLimitAtom", state))

export const createThreadAction = reatomAsync(async (ctx) => {
  const title = ctx.get(threadFormTitleAtom)
  const description = ctx.get(threadFormDescriptionAtom)
  const visibility = ctx.get(threadFormVisibilityAtom)
  const permission = ctx.get(threadFormPermissionAtom)
  const is_comments = ctx.get(threadFormIsCommentAtom)
  const tags = ctx.get(threadFormTagsAtom)
  const category_id = ctx.get(threadFormCategoryAtom)
  const nodes = ctx.get(threadFormContentAtom)
  const files = ctx.get(threadFormImagesAtom)

  if (!title || !category_id) throw new Error("form-error")

  const content = JSON.stringify(nodes)

  let rawImages: File[] = [];

  if (files && files.length > 0) {
    rawImages = [];

    for (let i = 0; i < rawImages.length; i++) {
      const rawImageItem = await blobUrlToFile(files[i]);

      rawImages.push(rawImageItem);
    }
  }

  return await ctx.schedule(async () => {
    const url = forumThreadClient.thread["create-thread"].$url()
    const images = await fileArrayToUint8Array(rawImages)

    const structure: z.infer<typeof createThreadSchemaRequest> = {
      category_id, title, visibility, content, description, tags, permission, is_comments, images
    };

    const res = await ky.post(url, {
      // @ts-expect-error
      body: encode(structure),
      headers: { 'Content-Type': 'application/cbor' },
      credentials: "include"
    })

    const data = await res.json<CreateThreadResponse>();

    if ("error" in data) throw new Error(data.error)

    return data;
  })
}, {
  name: "createThreadAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      if (e.message === 'form-error') {
        toast.error("Форма должна быть заполнена")
      }
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return

    const images = ctx.get(threadFormImagesAtom)

    if (res.status === 'Created') {
      toast.success("Тред создан");

      if (images) {
        for (let i = 0; i < images.length; i++) {
          URL.revokeObjectURL(images[i]);
        }
      }

      createThreadFormReset(ctx)

      ctx.schedule(() => navigate(createIdLink("thread", res.data.id)))
    }
  }
}).pipe(withStatusesAtom())