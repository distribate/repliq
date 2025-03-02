import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CURRENT_USER_QUERY_KEY } from "@repo/lib/queries/current-user-query.ts";
import { z } from "zod";
import { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema.ts"
import { REQUESTED_USER_QUERY_KEY } from "@repo/lib/queries/requested-user-query";
import { getUser } from "@repo/lib/helpers/get-user";
import { deleteCoverImage } from "#queries/delete-cover-image";
import { CreateCoverImage, createCoverImage } from "#queries/create-cover-image.ts";

export type CoverImageInput = z.infer<typeof createCoverImageSchema>;

export const USER_COVER_DELETE_IMAGE_MUTATION_KEY = ["user-cover-delete"];
export const USER_COVER_UPDATE_IMAGE_MUTATION_KEY = ["user-cover-update"];

export const useControlCoverImage = () => {
  const { nickname } = getUser()
  const qc = useQueryClient();

  const deleteBackgroundImageMutation = useMutation({
    mutationKey: USER_COVER_DELETE_IMAGE_MUTATION_KEY,
    mutationFn: deleteCoverImage,
    onSuccess: async (data) => {
      if (!data) {
        return toast.error("Произошла ошибка при удалении фона.", {
          description: "Попробуйте попытку позже!",
        });
      }

      toast.success("Фон удалён.");

      qc.setQueryData(CURRENT_USER_QUERY_KEY, (prev: any) => ({
        ...prev, cover_image: null,
      }));

      qc.setQueryData(REQUESTED_USER_QUERY_KEY(nickname), (prev: any) => ({
        ...prev, cover_image: null,
      }))
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  const uploadBackgroundImageMutation = useMutation({
    mutationKey: USER_COVER_UPDATE_IMAGE_MUTATION_KEY,
    mutationFn: async (values: CreateCoverImage) => createCoverImage(values),
    onSuccess: async (data) => {
      if (!data || !data.data) return toast.error("Произошла ошибка при обновлении фона.", {
        description: "Попробуйте попытку позже!",
      });

      toast.success("Фон обновлен.");

      qc.setQueryData(CURRENT_USER_QUERY_KEY, (prev: any) => ({
        ...prev, cover_image: data.data,
      }));

      qc.setQueryData(REQUESTED_USER_QUERY_KEY(nickname), (prev: any) => ({
        ...prev, cover_image: data.data,
      }))
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  return { uploadBackgroundImageMutation, deleteBackgroundImageMutation };
};