import { forumUserClient } from "@repo/shared/api/forum-client";
import type { InferResponseType } from "hono/client"
import { encode } from "cbor-x"
import ky from "ky"
import { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema.ts"
import { fileArrayToUint8Array } from "@repo/lib/helpers/file-array-to-uint8-array.ts";
import { z } from "zod"

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