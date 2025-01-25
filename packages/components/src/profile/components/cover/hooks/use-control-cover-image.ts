import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CURRENT_USER_QUERY_KEY } from "@repo/lib/queries/current-user-query.ts";
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets.ts";
import {
  createTask,
  registerTaskQueue,
} from "@repo/lib/helpers/create-task-delay.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { REQUESTED_USER_QUERY_KEY } from "#profile/components/cover/queries/requested-user-query.ts";
import { IMAGE_COVER_QUERY_KEY } from "#profile/components/cover/queries/image-cover-query.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { z } from "zod";
import type { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema";
import ky from "ky";

type BackgroundImage = {
  file: File | null;
  customFilename: string | null;
};

export type CoverImageInput = {
  type: "origin" | "library";
  file: File | null;
  fileName?: string;
};

export const USER_COVER_DELETE_IMAGE_MUTATION_KEY = ["user-cover-delete"];
export const USER_COVER_UPDATE_IMAGE_MUTATION_KEY = ["user-cover-update"];

async function createCoverImage({
  file, type
}: z.infer<typeof createCoverImageSchema>) {
  const url = forumUserClient.user["create-cover-image"].$url();

  const fd = new FormData();

  if (file) {
    fd.append("file", file);
  }

  fd.append("type", type);

  const res = await ky.post(url, {
    body: fd,
    credentials: "include",
  })

  return await res.json()
}

export const useControlCoverImage = () => {
  const qc = useQueryClient();
  const currentUser = getUser();

  const revalidateUserQueries = async () => {
    await Promise.all([
      qc.invalidateQueries({
        queryKey: REQUESTED_USER_QUERY_KEY(currentUser.nickname),
      }),
      qc.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY }),
    ]);

    const tasks = [
      createTask(async () => {
        await qc.invalidateQueries({
          queryKey: IMAGE_COVER_QUERY_KEY(currentUser.nickname),
        });
      }, 1000),
    ];

    registerTaskQueue(tasks);
  };

  const deleteBackgroundImageMutation = useMutation({
    mutationKey: USER_COVER_DELETE_IMAGE_MUTATION_KEY,
    mutationFn: async () => null,
    onSuccess: async (data) => {
      // if (!data)
      //   return toast.error("Произошла ошибка при удалении фона.", {
      //     description: "Попробуйте попытку позже!",
      //   });

      // toast.success("Фон удалён.");

      // updateValueOfUploadedImage({
      //   table: "users",
      //   field: {
      //     cover_image: null,
      //   },
      //   equals: {
      //     column: "id",
      //     value: currentUser.id,
      //   },
      // });

      // return revalidateUserQueries();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const uploadBackgroundImageMutation = useMutation({
    mutationKey: USER_COVER_UPDATE_IMAGE_MUTATION_KEY,
    onMutate: async (variables) => {
      if (!variables.file && !variables.customFilename) {
        // if custom image from user
        return toast.error("Выберите изображение");
      }
    },
    mutationFn: async ({ file, customFilename }: BackgroundImage) => {
      // if upload to existing image from storage (static)
      
      return createCoverImage({
        file, type: "custom"
      })
    },
    onSuccess: async (data) => {
      // if (!data) {
      //   toast.error("Произошла ошибка при обновлении фона.", {
      //     description: "Попробуйте попытку позже!",
      //   });

      //   return;
      // }

      // if (typeof data === "boolean") {
      //   toast.success("Фон шапки профиля обновлен!");
      //   return revalidateUserQueries();
      // }

      // if (typeof data === "object") {
      //   if (data.error) {
      //     toast.error("Произошла ошибка при обновлении фона.", {
      //       description: data.error.message,
      //     });

      //     return;
      //   }

      //   if (data.path) {
      //     const success = await updateValueOfUploadedImage({
      //       table: "users",
      //       field: { cover_image: data.path },
      //       equals: { column: "id", value: currentUser.id },
      //     });

      //     if (!success) {
      //       toast.error("Произошла ошибка при обновлении фона.", {
      //         description: "Попробуйте попытку позже!",
      //       });

      //       return;
      //     }

      //     toast.success("Фон шапки профиля обновлен!");
      //     revalidateUserQueries();
      //     return { success, path: data.path };
      //   }
      // }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { uploadBackgroundImageMutation, deleteBackgroundImageMutation };
};