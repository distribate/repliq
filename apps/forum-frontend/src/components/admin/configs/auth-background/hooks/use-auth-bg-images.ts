import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { forumAdminClient } from "@repo/shared/api/forum-client.ts";
import { createAuthImageSchema } from "@repo/types/schemas/admin/create-auth-image-schema";
import ky from "ky";
import { z } from "zod";

async function createAuthImage({
  files
}: z.infer<typeof createAuthImageSchema>) {
  const url = forumAdminClient.admin["create-auth-image"].$url()

  const res = await ky.post(url, {
    json: {
      files
    }
  })

  if (!res.ok) {
    return "no-data"
  }

  return await res.json()
}

export const useAuthBackgroundImage = () => {
  const router = useRouter();

  const deleteAuthImageFileMutation = useMutation({
    mutationFn: async (imageName: string) => {
      return null
    },
    onSuccess: async (data, variables) => {
      if (!data)
        return toast.error("Произошла ошибка при удалении изображения");

      toast.success("Изображение удалено");

      return router.invalidate();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const addAuthImageFileMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const convertedFiles = Array.from(files).slice(0, 3);

      // let base64Files: string[] = [];

      // for (let i = 0; i < convertedFiles.length; i++) {
      //   const rawFile = convertedFiles[i];
      //   const fileSize = getFileSizeInMB(rawFile);

      //   if (Number(fileSize.toFixed()) >= 10) {
      //     return;
      //   }

      //   const file = await getArrayBuffer(convertedFiles[i]);
      //   const encodedFile = encode(file);

      //   base64Files.push(encodedFile);
      // }

      return createAuthImage({ files: convertedFiles })
    },
    onSuccess: async (data, variables) => {
      if (!data) return toast.error("Произошла ошибка при загрузке изображения");

      // if (!Array.isArray(data)) {
      //   if (data.error === "no-data") return toast.error("Что-то пошло не так при загрузке изображений.", {
      //     description: "Попробуйте попытку позже",
      //   });

      //   if (data.error === "limit") return toast.info("Изображений может быть только 50!");
      // }

      toast.success("Изображение загружено");

      return router.invalidate();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { addAuthImageFileMutation, deleteAuthImageFileMutation };
};