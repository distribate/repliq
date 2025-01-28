import { forumThreadClient } from "@repo/shared/api/forum-client";
import { createThreadSchema as initial } from "@repo/types/schemas/thread/create-thread-schema.ts";
import { z } from "zod";
import ky from "ky";
import { encode } from "cbor-x";
import { CreateThreadResponse } from "@repo/types/routes-types/create-thread-types";

const createThreadSchemaRequest = initial.omit({
  images: true
}).extend({
  images: z.array(z.instanceof(Uint8Array)).nullable(),
})

const createThreadSchema = createThreadSchemaRequest.extend({
  images: z.array(z.instanceof(File)).nullable(),
})

type CreateThread = z.infer<typeof createThreadSchema>;

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

export async function createThread({
  category_id, title, visibility, content, description,
  images: rawImages, is_comments, permission, tags
}: CreateThread) {
  const url = forumThreadClient.thread["create-thread"].$url()

  const images = await fileArrayToUint8Array(rawImages)

  let structure: z.infer<typeof createThreadSchemaRequest> = {
    category_id, title, visibility, content, description, tags, permission, is_comments, images
  };

  const encodedData = encode(structure);

  const res = await ky.post(url, {
    body: encodedData,
    headers: {
      'Content-Type': 'application/cbor',
    },
    credentials: "include"
  })

  const data = await res.json<CreateThreadResponse>();

  if (!data || "error" in data) {
    return null;
  }

  return data;
}