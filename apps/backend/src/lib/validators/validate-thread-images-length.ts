import { getUserDonate } from "#lib/queries/user/get-user-donate.ts"

export const validateThreadImagesLength = async (nickname: string, images: File[]) => {
  const isDonate = await getUserDonate(nickname)

  if (images.length <= 2) {
    return images
  } else if (images.length > 2) {
    if (!isDonate) {
      return images.slice(0, 2)
    }
  }

  return images.slice(0, 3)
}