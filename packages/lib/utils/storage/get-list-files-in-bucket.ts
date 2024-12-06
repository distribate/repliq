'use server';

import { createClient } from '#utils/api/supabase-client.ts';

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
  }
};

export async function getSignedURLs({
  bucket, folderName,
  properties = {
    limit: 50,
    offset: 0,
    sortBy: { col: 'name', order: 'asc' },
  }
}: GetListFilesInBucket) {
  const api = createClient();
  
  const { data: retriviedImages, error: retrievedImagesErr } = await api.storage
  .from(bucket)
  .list(folderName, {
    limit: properties.limit,
    offset: properties.offset,
    sortBy: {
      column: properties.sortBy?.col,
      order: properties.sortBy?.order,
    },
  });
  
  if (retrievedImagesErr) {
    throw new Error(retrievedImagesErr.message)
  }
  
  const { data: signedURLS, error } = await api.storage
  .from(bucket)
  .createSignedUrls(
    retriviedImages.map((image) => folderName + '/' + image.name),
    600,
  );
  
  if (error) {
    throw new Error('Error in process signified images');
  }
  
  if (!signedURLS || !signedURLS.length) return null;
  
  return signedURLS;
}

export async function getListFilesInBucket({
  bucket,
  folderName,
  properties = {
    limit: 50,
    offset: 0,
    sortBy: { col: 'name', order: 'asc' },
  },
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
      `Something wrong error in retrieving images from ${bucket + '/' + folderName} destination.`,
    );
  }
  
  if (!rawRetriviedImages || rawRetriviedImages.length === 0) return null;
  
  return rawRetriviedImages;
}