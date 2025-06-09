import { threadFormImagesAtom } from "./thread-form.model";
import { THREAD_IMAGES_LIMIT_DEFAULT } from "@repo/shared/constants/limits";
import { currentUserAtom } from "@repo/lib/helpers/get-user";
import { action } from "@reatom/core";

type CreateThreadImageControl =
  | { type: "add", images: Array<File> | null }
  | { type: "delete", index: number }

export const handleControlImagesAction = action((ctx, values: CreateThreadImageControl) => {
  const images = ctx.get(threadFormImagesAtom)

  switch (values.type) {
    case "add":
      if (!values.images) return;

      let fileList: Array<string> | null = null;

      if (images && images.length >= 1) {
        const stringFileList = values.images.map(f => URL.createObjectURL(f));

        fileList = [...images, ...stringFileList];
      } else {
        fileList = values.images.map(f => URL.createObjectURL(f))
      }

      return threadFormImagesAtom(ctx, fileList)
    case "delete":
      const { index } = values;

      if (!images) return;

      if (images.length <= 1) {
        return threadFormImagesAtom(ctx, null)
      } else {
        const updatedFormImages = images.filter((_, i) => i !== index);

        return threadFormImagesAtom(ctx, updatedFormImages)
      }
  }
})

export const handleAddImagesAction = action((
  ctx, 
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const currentUser = ctx.get(currentUserAtom)
  if (!currentUser) return;

  const MAX_IMAGES = currentUser?.donate === "default" ? THREAD_IMAGES_LIMIT_DEFAULT[1] : 3;

  const images = e.target.files
    ? (Array.from(e.target.files).slice(THREAD_IMAGES_LIMIT_DEFAULT[0], MAX_IMAGES) as Array<File>)
    : null;

  e.preventDefault();

  return handleControlImagesAction(ctx, { type: "add", images });
})

export const handleDeleteImageAction = action((
  ctx, 
  e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>, 
  idx: number
) => {
  e.preventDefault();
  return handleControlImagesAction(ctx, { index: idx, type: "delete" });
})