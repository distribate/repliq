import { getAuthBackgroundImages } from "@repo/lib/queries/get-auth-background-images.ts";
import { getPublicUrlFromStorage } from "@repo/lib/utils/storage/get-public-url-from-storage.ts";

type AuthImages = {
  name: string;
  url: string;
};

export async function getAuthImages() {
  const authBackgroundImages = await getAuthBackgroundImages();

  if (!authBackgroundImages) {
    return null;
  }

  let images: Array<AuthImages> = [];

  for (let i = 0; i < authBackgroundImages.length; i++) {
    const imageName = authBackgroundImages[i]?.name;

    const image = await getPublicUrlFromStorage({
      bucket: "static",
      fileName: `auth_background/${imageName}`,
    });

    images.push({
      name: imageName,
      url: image,
    });
  }

  if (images.length === 0) return null;

  return images;
}
