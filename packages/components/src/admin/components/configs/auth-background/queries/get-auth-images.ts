import { getPublicUrlFromStorage } from "@repo/lib/utils/storage/get-public-url-from-storage.ts";
import { forumAdminClient } from "@repo/shared/api/forum-client";

type AuthImages = {
  name: string;
  url: string;
};

async function getAuthBackgroundImages() {
  const res = await forumAdminClient.admin["get-auth-images"].$get();

  const data = await res.json();

  if ("error" in data) {
    return null;
  }

  return data.data;
}

export async function getAuthImages() {
  const authBackgroundImages = await getAuthBackgroundImages();

  if (!authBackgroundImages) return null

  let images: Array<AuthImages> = [];

  for (let i = 0; i < authBackgroundImages.length; i++) {
    const name = authBackgroundImages[i]?.name;

    const image = await getPublicUrlFromStorage({
      bucket: "static",
      fileName: `auth_background/${name}`,
    });

    images.push({ name, url: image });
  }

  if (images.length === 0) return null;

  return images;
}