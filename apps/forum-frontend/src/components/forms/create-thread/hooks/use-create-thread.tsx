import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  THREAD_FORM_QUERY,
  ThreadFormQuery,
} from "../queries/thread-form-query.ts";
import { createThread } from "../queries/create-thread.ts";
import { toast } from "sonner";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { THREAD_CONTENT_LIMIT_DEFAULT, THREAD_IMAGES_LIMIT_DEFAULT } from "@repo/shared/constants/limits.ts";
import { blobUrlToFile } from "@repo/lib/helpers/blobUrlToFile.ts";
import { useNavigate } from "@tanstack/react-router";
import { getUser } from "@repo/lib/helpers/get-user.ts";

type CreateThreadImageControl =
  | { type: "add", images: Array<File> | null }
  | { type: "delete", index: number }

export function getContentLimit(images: Array<File> | string[] | null): number {
  return images && images.length > 0
    ? THREAD_CONTENT_LIMIT_DEFAULT[1]
    : THREAD_CONTENT_LIMIT_DEFAULT[2];
}

export const useCreateThread = () => {
  const { donate } = getUser()
  const qc = useQueryClient();
  const navigate = useNavigate();

  const updateThreadFormMutation = useMutation({
    mutationFn: async (values: Partial<ThreadFormQuery>) =>
      qc.setQueryData(THREAD_FORM_QUERY, (prev: ThreadFormQuery) => ({ ...prev, ...values })),
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const createPostThreadMutation = useMutation({
    mutationFn: async () => {
      const form = qc.getQueryData<ThreadFormQuery>(THREAD_FORM_QUERY);

      if (!form) return "form-error";

      const {
        title, description, visibility, permission, is_comments,
        tags, category_id, content: rawContent, images,
      } = form;

      if (!title || !rawContent || !category_id || !visibility) return;

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

      const content = JSON.stringify(rawContent);

      return createThread({
        category_id, title, visibility, images: imagesFiles, tags, description, is_comments, permission, content
      });
    },
    onSuccess: async (data) => {
      if (!data) {
        return toast.error("Произошла ошибка при создании треда")
      }

      if (data === "form-error") {
        return toast.error("Форма должна быть заполнена")
      }

      if (data.status === 'Created') {
        toast.success("Тред создан");

        const formValues = qc.getQueryData<ThreadFormQuery>(THREAD_FORM_QUERY);

        if (formValues && formValues.images) {
          for (let i = 0; i < formValues.images.length; i++) {
            URL.revokeObjectURL(formValues.images[i]);
          }
        }

        qc.resetQueries({ queryKey: THREAD_FORM_QUERY });

        return navigate({ to: THREAD_URL + data.data.id });
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const handleControlImage = (values: CreateThreadImageControl) => {
    const form = qc.getQueryData<ThreadFormQuery>(THREAD_FORM_QUERY);

    if (!form) return;

    switch (values.type) {
      case "add":
        if (!values.images) return;

        let fileList: Array<string> | null = null;

        if (form.images && form.images.length >= 1) {
          const stringFileList = values.images.map(f => URL.createObjectURL(f));

          fileList = [...form.images, ...stringFileList];
        } else {
          fileList = values.images.map(f => URL.createObjectURL(f))
        }

        return updateThreadFormMutation.mutate({ images: fileList });
      case "delete":
        const { index } = values;
        const { images } = form;

        if (!images) return;

        if (images.length <= 1) {
          return updateThreadFormMutation.mutate({ images: null });
        } else {
          const updatedFormImages = images.filter((_, i) => i !== index);

          return updateThreadFormMutation.mutate({ images: updatedFormImages });
        }
    }
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_IMAGES = donate === "default" ? THREAD_IMAGES_LIMIT_DEFAULT[1] : 3;

    const images = e.target.files
      ? (Array.from(e.target.files).slice(THREAD_IMAGES_LIMIT_DEFAULT[0], MAX_IMAGES) as Array<File>)
      : null;

    e.preventDefault();

    return handleControlImage({ type: "add", images });
  };

  const handleDeleteImage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>, idx: number,
  ) => {
    e.preventDefault();
    return handleControlImage({ index: idx, type: "delete" });
  };

  return { updateThreadFormMutation, createPostThreadMutation, handleControlImage, handleAddImages, handleDeleteImage };
};