import { toast } from "sonner";
import { THREAD_CONTENT_LIMIT_DEFAULT } from "@repo/shared/constants/limits.ts";
import { blobUrlToFile } from "@repo/lib/helpers/blobUrlToFile.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { router } from "#main.tsx";
import { forumThreadClient } from "@repo/shared/api/forum-client";
import { createThreadSchema as initial } from "@repo/types/schemas/thread/create-thread-schema.ts";
import { z } from "zod/v4";
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
import {
  threadCategorySchema, threadContentSchema, threadDescriptionSchema,
  threadTitleSchema, threadVisibilitySchema
} from "@repo/types/schemas/thread/create-thread-schema";

const createThreadSchemaV2 = z
  .object({
    title: threadTitleSchema,
    content: threadContentSchema,
    description: threadDescriptionSchema,
    category_id: threadCategorySchema,
    images: z.custom<File[] | null>(),
    is_comments: z.boolean(),
    tags: z.array(z.string()).nullable(),
    permission: z.boolean(),
    visibility: threadVisibilitySchema,
  })
  .check((ctx) => {
    const contentLimit = getContentLimit(ctx.value.images);

    if (ctx.value.content.length > contentLimit) {
      ctx.issues.push({
        input: "",
        code: "custom",
        path: ["content"],
        message: `Превышено максимальное количество символов (${contentLimit})`,
      });
    }
  });

const createThreadSchemaRequest = initial.omit({
  images: true
}).extend({
  images: z.array(z.instanceof(Uint8Array)).nullable(),
})

const createThreadSchema = createThreadSchemaRequest.extend({
  images: z.array(z.instanceof(File)).nullable(),
})

export const createThreadAction = reatomAsync(async (ctx) => {
  const title = ctx.get(threadFormTitleAtom)
  const description = ctx.get(threadFormDescriptionAtom)
  const visibility = ctx.get(threadFormVisibilityAtom)
  const permission = ctx.get(threadFormPermissionAtom)
  const is_comments = ctx.get(threadFormIsCommentAtom)
  const tags = ctx.get(threadFormTagsAtom)
  const category_id = ctx.get(threadFormCategoryAtom)
  const nodesContent = ctx.get(threadFormContentAtom)
  const images = ctx.get(threadFormImagesAtom)

  if (!title || !category_id) return "form-error";

  const stringContent = JSON.stringify(nodesContent)

  if (!title || !stringContent || !category_id || !visibility) return;

  let imagesFiles: File[] | null;

  if (images) {
    imagesFiles = [];

    for (let i = 0; i < images.length; i++) {
      const rawImageItem = await blobUrlToFile(images[i]);

      imagesFiles.push(rawImageItem);
    }
  } else {
    imagesFiles = null
  }

  return await createThread({
    images: imagesFiles, content: stringContent, category_id, title, visibility, tags, description, is_comments, permission,
  });
}, {
  name: "createThreadAction",
  onFulfill: (ctx, res) => {
    if (!res) {
      return toast.error("Произошла ошибка при создании треда")
    }

    if (res === "form-error") {
      return toast.error("Форма должна быть заполнена")
    }

    const images = ctx.get(threadFormImagesAtom)

    if (res.status === 'Created') {
      toast.success("Тред создан");

      if (images) {
        for (let i = 0; i < images.length; i++) {
          URL.revokeObjectURL(images[i]);
        }
      }

      createThreadFormReset(ctx)

      ctx.schedule(() => router.navigate({ to: createIdLink("thread", res.data.id) }))
    }
  }
}).pipe(withStatusesAtom())

export function getContentLimit(images: Array<File> | string[] | null): number {
  return images && images.length > 0 ? THREAD_CONTENT_LIMIT_DEFAULT[1] : THREAD_CONTENT_LIMIT_DEFAULT[2];
}

export async function createThread({
  category_id, title, visibility, content, description,
  images: rawImages, is_comments, permission, tags
}: z.infer<typeof createThreadSchema>) {
  const url = forumThreadClient.thread["create-thread"].$url()
  const images = await fileArrayToUint8Array(rawImages)

  let structure: z.infer<typeof createThreadSchemaRequest> = {
    category_id, title, visibility, content, description, tags, permission, is_comments, images
  };

  const encodedData = encode(structure);
  const res = await ky.post(url, {
    body: encodedData,
    headers: { 'Content-Type': 'application/cbor' },
    credentials: "include"
  })

  const data = await res.json<CreateThreadResponse>();
  if (!data || "error" in data) return null;
  return data;
}
