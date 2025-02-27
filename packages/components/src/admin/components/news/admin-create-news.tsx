import { fileArrayToUint8Array } from "#forms/create-thread/queries/create-thread.ts";
import { blobUrlToFile } from "@repo/lib/helpers/blobUrlToFile";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { NEWS_QUERY_KEY } from "@repo/lib/queries/news-query";
import { forumAdminClient } from "@repo/shared/api/forum-client";
import { createNewsSchema } from "@repo/types/schemas/admin/create-news-schema";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea";
import { Button } from "@repo/ui/src/components/button";
import { DeleteButton } from "@repo/ui/src/components/detele-button";
import { Input } from "@repo/ui/src/components/input";
import { Typography } from "@repo/ui/src/components/typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { encode } from "@tanstack/react-router";
import ky from "ky"
import { toast } from "sonner";
import { z } from "zod";

type CreateNews = Omit<z.infer<typeof createNewsSchema>, "image"> & {
  image: File | null
}

async function createNews({ title, description, image, media_links, tags }: CreateNews) {
  const url = forumAdminClient.admin["create-news"].$url()

  const images = await fileArrayToUint8Array(image ? [image] : null)

  let structure: z.infer<typeof createNewsSchema> = {
    title,
    description,
    image: images ? images[0] : null,
    media_links: media_links ? media_links.length ? media_links : undefined : undefined,
    tags: tags ? tags.length ? tags : undefined : undefined
  };

  const encodedData = encode(structure);

  const res = await ky.post(url, {
    body: encodedData,
    headers: {
      'Content-Type': 'application/cbor',
    },
    credentials: "include"
  })

  const data = await res.json<{ data: string } | { error: string }>();

  if (!data || "error" in data) {
    return null
  }

  return data
}

async function deleteNews(id: string) {
  const res = await forumAdminClient.admin["delete-news"][":id"].$delete({
    param: {
      id
    }
  })

  const data = await res.json() as { status: 'success' } | { error: string };

  if ("error" in data) {
    return null
  }

  return data;
}

export const CREATE_NEWS_QUERY_KEY = createQueryKey("ui", ["create-news"])

export type CreateNewsQuery = Omit<z.infer<typeof createNewsSchema>, 'image'> & {
  imageUrl?: string
}

export const createNewsQuery = () => useQuery<CreateNewsQuery, Error>({
  queryKey: CREATE_NEWS_QUERY_KEY,
})

export const useNews = () => {
  const qc = useQueryClient()

  const createNewsMutation = useMutation({
    mutationFn: async () => {
      const formState = qc.getQueryData<CreateNewsQuery>(CREATE_NEWS_QUERY_KEY)

      if (!formState) return;

      let image: File | null = null

      if (formState.imageUrl) {
        image = await blobUrlToFile(formState.imageUrl)
      }

      return createNews({ image, ...formState })
    },
    onSuccess: async (data) => {
      if (!data) return

      if (data.data) {
        qc.resetQueries({
          queryKey: CREATE_NEWS_QUERY_KEY
        })

        return toast.success('Новость успешно создана')
      }

      return toast.error("Произошла ошибка при создании новости")
    },
    onError: (e) => { throw new Error(e.message) }
  })

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => deleteNews(id),
    onSuccess: (data, variables) => {
      if (!data) return;

      qc.setQueryData(NEWS_QUERY_KEY, (prev: { data: { id: string }[], meta: any }) => ({
        ...prev,
        data: prev?.data.filter(n => n.id !== variables),
      }))

      return toast.success('Новость успешно удалена')
    },
    onError: e => { throw new Error(e.message) }
  })

  return { createNewsMutation, deleteNewsMutation }
}

export const CreateNews = () => {
  const qc = useQueryClient()
  const { data } = createNewsQuery()
  const { createNewsMutation } = useNews()

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    type: "title" | "description"
  ) => {
    qc.setQueryData(CREATE_NEWS_QUERY_KEY,
      (prev: CreateNewsQuery) => ({ ...prev, [type]: e.target.value })
    )
  }

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;
    if (!e.target.files) return;

    const image = e.target.files[0];

    qc.setQueryData(CREATE_NEWS_QUERY_KEY,
      (prev: CreateNewsQuery) => ({ ...prev, imageUrl: URL.createObjectURL(image) })
    )
  }

  const deleteImage = () => {
    qc.setQueryData(CREATE_NEWS_QUERY_KEY,
      (prev: CreateNewsQuery) => ({ ...prev, imageUrl: undefined })
    )
  }

  const onSubmit = () => createNewsMutation.mutate()

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="flex flex-col w-full pt-2 pb-1 border border-shark-700 rounded-md">
          <div className="flex items-center gap-1 px-4">
            <Typography textColor="gray">Название</Typography>
          </div>
          <Input
            autoComplete="off"
            value={data?.title ?? ""}
            onChange={e => onChange(e, "title")}
            name="title"
            backgroundType="transparent"
            className="!text-[16px]"
            placeholder="Название новости"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 w-full">
        <div className="flex flex-col w-full pt-2 pb-1 border border-shark-700 rounded-md">
          <div className="flex items-center gap-1 px-4">
            <Typography textColor="gray">Описание</Typography>
          </div>
          <AutogrowingTextarea
            autoComplete="off"
            value={data?.description ?? ""}
            onChange={e => onChange(e as React.ChangeEvent<HTMLTextAreaElement>, "description")}
            name="description"
            maxLength={1000}
            className="!text-[16px] resize-none"
            placeholder="Описание новости"
          />
        </div>
      </div>
      {data?.imageUrl && (
        <div className="flex items-center gap-2 w-full">
          <div className="flex flex-col w-full pt-2 pb-1 border border-shark-700 rounded-md">
            <div className="flex items-center gap-1 px-4">
              <Typography textColor="gray">Прикрепленное изображение</Typography>
            </div>
            <div className="px-4 py-2 relative group w-full lg:w-1/3 h-1/3">
              <img src={data.imageUrl} className="rounded-lg w-full h-full object-cover" />
              <DeleteButton variant="invisible" onClick={() => deleteImage()} />
            </div>
          </div>
        </div>
      )}
      <div className="flex relative overflow-hidden w-full items-center justify-end h-10">
        <Button
          onClick={onSubmit}
          disabled={createNewsMutation.isPending}
          className="w-fit bg-shark-50 relative"
        >
          <Typography className="text-[18px] text-shark-950 font-semibold">
            Загрузить изображение
          </Typography>
          <input
            type="file"
            accept="image/webp,image/png,image/jpeg,image/jpg"
            onChange={onChangeImage}
            className="absolute opacity-0 cursor-pointer w-full h-full"
          />
        </Button>
      </div>
      <Button
        variant="positive"
        onClick={onSubmit}
        pending={createNewsMutation.isPending}
        disabled={createNewsMutation.isPending || !data?.title || !data?.description}
        className="w-full lg:w-fit mt-2 px-12"
      >
        <Typography className="font-semibold text-[18px]">
          Создать
        </Typography>
      </Button>
    </div>
  )
}