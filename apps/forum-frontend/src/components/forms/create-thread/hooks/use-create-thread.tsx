import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  THREAD_FORM_QUERY,
  ThreadFormQuery,
} from "../queries/thread-form-query.ts";
import { createThread } from "../queries/create-thread.ts";
import { toast } from "sonner";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { THREAD_CONTENT_LIMIT_DEFAULT } from "@repo/shared/constants/limits.ts";
import { blobUrlToFile } from "@repo/lib/helpers/blobUrlToFile.ts";
import { useNavigate } from "@tanstack/react-router";

export function getContentLimit(images: Array<File> | string[] | null): number {
  return images && images.length > 0 ? THREAD_CONTENT_LIMIT_DEFAULT[1] : THREAD_CONTENT_LIMIT_DEFAULT[2];
}

export const useCreateThread = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const createPostThreadMutation = useMutation({
    mutationFn: async () => {
      const form = qc.getQueryData<ThreadFormQuery>(THREAD_FORM_QUERY);

      if (!form) return "form-error";

      const {
        title, description, visibility, permission, is_comments,
        tags, category_id, content: nodesContent, images,
      } = form;

      const stringContent = JSON.stringify(nodesContent)

      if (!title || !stringContent || !category_id || !visibility) return;

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


      return createThread({
        images: imagesFiles, content: stringContent, 
        category_id, title, visibility,tags, description, 
        is_comments, permission, 
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

  return { 
    createPostThreadMutation
  };
};