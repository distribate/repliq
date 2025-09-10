import { toast } from "sonner";
import { THREAD_CONTENT_LIMIT_DEFAULT } from "@repo/shared/constants/limits.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { threadClient } from "#shared/forum-client";
import { createThreadSchema as initial } from "@repo/types/schemas/thread/create-thread-schema.ts";
import * as z from "zod";
import { encode } from "cbor-x";
import { CreateThreadResponse } from "@repo/types/routes-types/create-thread-types";
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
import { createIdLink } from "#shared/helpers/create-link";
import { atom } from "@reatom/core";
import { navigate, prefetch } from "vike/client/router";
import { client } from "#shared/api/client";
import { log } from "#shared/utils/log";

const blobUrlToFile = (blobUrl: string): Promise<File> => {
  return new Promise((resolve) => {
    fetch(blobUrl).then((res) => {
      res.blob().then((blob) => {
        const file = new File([blob], "png", { type: blob.type });
        resolve(file);
      });
    });
  });
};

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

export const fileArrayToUint8Array = async (files: File[] | null) => {
  if (!files) return null;

  const uint8ArrayFiles = await Promise.all(
    files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      return new Uint8Array(buffer);
    })
  );

  return uint8ArrayFiles;
};

const url = threadClient.thread["create"].$url()

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

  let images: Uint8Array<ArrayBuffer>[] | null = null;

  if (files) {
    const rawImages = await Promise.all(files.map((f) => blobUrlToFile(f)));
    console.log(rawImages)
    images = await fileArrayToUint8Array(rawImages);
  }

  console.log(files, images)

  const structure: z.infer<typeof createThreadSchemaRequest> = {
    category_id, title, visibility, content, description, tags, permission, is_comments, images
  };

  const body = new Uint8Array(encode(structure))

  return await ctx.schedule(async () => {
    const res = await client.post(url, {
      body,
      headers: { 'Content-Type': 'application/cbor' }
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

      console.error(e.message)
    }
  },
  onFulfill: async (ctx, res) => {
    if (!res) return

    const images = ctx.get(threadFormImagesAtom)

    if (res.status === 'Created') {
      const link = createIdLink("thread", res.data.id)

      prefetch(link)

      toast.success("Тред создан");

      if (images) {
        for (let i = 0; i < images.length; i++) {
          URL.revokeObjectURL(images[i]);
        }
      }

      createThreadFormReset(ctx)

      await ctx.schedule(() => navigate(link))
    }
  }
}).pipe(withStatusesAtom())

contentLimitAtom.onChange((_, v) => log("contentLimitAtom", v))