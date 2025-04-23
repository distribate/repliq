import { useMutation, useQueryClient } from "@tanstack/react-query";
import { THREAD_FORM_QUERY, ThreadFormQuery } from "../queries/thread-form-query";
import { THREAD_IMAGES_LIMIT_DEFAULT } from "@repo/shared/constants/limits";
import { getUser } from "@repo/lib/helpers/get-user";

type CreateThreadImageControl =
  | { type: "add", images: Array<File> | null }
  | { type: "delete", index: number }

export const useEditThread = () => {
  const qc = useQueryClient();
  const { donate } = getUser()

  const updateThreadFormMutation = useMutation({
    mutationFn: async (values: Partial<ThreadFormQuery>) => {
      return qc.setQueryData(
        THREAD_FORM_QUERY, (prev: ThreadFormQuery) => ({ ...prev, ...values })
      )
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

  return {
    handleAddImages, handleControlImage, handleDeleteImage, updateThreadFormMutation
  }
}