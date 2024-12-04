"use server";

import { createClient } from "#utils/api/supabase-client.ts";

type GetListFilesInBucket = {
  bucket: string;
  folderName: string;
  properties?: {
    limit: number;
    offset: number;
    sortBy: {
      col: string;
      order: string;
    };
  };
  signed: boolean;
};

export async function getListFilesInBucket({
  bucket,
  folderName,
  properties = {
    limit: 50,
    offset: 0,
    sortBy: { col: "name", order: "asc" },
  },
  signed = false,
}: GetListFilesInBucket) {
  const api = createClient();

  const { data: rawRetriviedImages, error } = await api.storage
    .from(bucket)
    .list(folderName, {
      limit: properties.limit,
      offset: properties.offset,
      sortBy: {
        column: properties.sortBy?.col,
        order: properties.sortBy?.order,
      },
    });

  if (error) {
    throw new Error(
      `Something wrong error in retrieving images from ${bucket + "/" + folderName} destination.`,
    );
  }

  if (!rawRetriviedImages || rawRetriviedImages.length === 0) return null;

  if (signed) {
    const { data: signedURLS, error } = await api.storage
      .from(bucket)
      .createSignedUrls(
        rawRetriviedImages.map((image) => folderName + "/" + image.name),
        300,
      );

    if (error) {
      throw new Error("Error in process signified images");
    }

    if (!signedURLS || !signedURLS.length) return null;

    return signedURLS;
  }

  return rawRetriviedImages;
}
