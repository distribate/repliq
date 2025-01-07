import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  THREAD_FORM_QUERY,
  ThreadFormQuery,
} from "../queries/thread-form-query.ts";
import { postThread } from "../queries/post-thread.ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { getArrayBuffer } from "@repo/lib/helpers/ger-array-buffer.ts";
import { encode } from "base64-arraybuffer";
import { blobUrlToFile } from "@repo/lib/helpers/blobUrlToFile.ts";
import { THREAD_CONTENT_LIMIT_DEFAULT } from "@repo/shared/constants/limits.ts";

type CreateThreadImageControl = {
  type: "add" | "delete";
  index?: number;
  resetField?: Function;
  setValue?: Function;
  images: File[] | null;
};

export function getContentLimit(images: File[] | string[] | null): number {
  return images && images.length > 0
    ? THREAD_CONTENT_LIMIT_DEFAULT[1]
    : THREAD_CONTENT_LIMIT_DEFAULT[2];
}

export const useCreateThread = () => {
  const qc = useQueryClient();
  const { push } = useRouter();

  const updateThreadFormMutation = useMutation({
    mutationFn: async (values: ThreadFormQuery) => {
      return qc.setQueryData(THREAD_FORM_QUERY, (prev: ThreadFormQuery) => ({
        ...prev,
        ...values,
      }));
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const createPostThreadMutation = useMutation({
    mutationFn: async () => {
      const form = qc.getQueryData<ThreadFormQuery>(THREAD_FORM_QUERY);
      if (!form) return "form-error";

      const {
        title,
        description,
        visibility,
        permission,
        is_comments,
        tags,
        category_id,
        content,
        images,
      } = form;

      if (!title || !content || !category_id || !visibility) return;

      let base64Files: Array<string> | null = null;
      let threadRawImages: Array<File> | null = null;

      if (images) {
        threadRawImages = [];

        for (let i = 0; i < images.length; i++) {
          const rawImageItem = await blobUrlToFile(images[i]);
          threadRawImages.push(rawImageItem);
        }

        if (threadRawImages) {
          base64Files = [];

          for (let i = 0; i < threadRawImages.length; i++) {
            const imageItem = await getArrayBuffer(threadRawImages[i]);
            const encodedImageItem = encode(imageItem);

            base64Files.push(encodedImageItem);
          }
        } else {
          base64Files = null;
        }
      }

      return postThread({
        category_id,
        title,
        visibility,
        base64Files,
        tags: tags ?? undefined,
        content: JSON.stringify(content),
        description: description ?? null,
        is_comments: is_comments ?? true,
        permission: false, // todo: add thread permission
      });
    },
    onSuccess: async (data) => {
      if (!data) return toast.error("Произошла ошибка при создании треда");
      if (data === "form-error")
        return toast.error("Форма должна быть заполнена");

      toast.success("Тред создан");

      const formValues = qc.getQueryData<ThreadFormQuery>(THREAD_FORM_QUERY);

      if (formValues && formValues && formValues.images) {
        for (let i = 0; i < formValues.images.length; i++) {
          URL.revokeObjectURL(formValues.images[i]);
        }
      }

      qc.resetQueries({ queryKey: THREAD_FORM_QUERY });

      return push(THREAD_URL + data);
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const handleControlImage = (values: CreateThreadImageControl) => {
    const { index, type, images, resetField, setValue } = values;

    if (!images) return;

    if (type === "add") {
      const convertedFileList = images.map((file) => URL.createObjectURL(file));
      return updateThreadFormMutation.mutate({ images: convertedFileList });
    } else if (
      type === "delete" &&
      index !== undefined &&
      resetField &&
      setValue
    ) {
      if (images.length <= 1) {
        resetField("images");
        return updateThreadFormMutation.mutate({ images: null });
      } else {
        const updatedFormImages = images.filter((_, i) => i !== index);
        setValue("images", updatedFormImages);
        return updateThreadFormMutation.mutate({
          images: updatedFormImages.map((file) => URL.createObjectURL(file)),
        });
      }
    }
  };

  return {
    updateThreadFormMutation,
    createPostThreadMutation,
    handleControlImage,
  };
};
