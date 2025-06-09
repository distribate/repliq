import { fileArrayToUint8Array } from "@repo/lib/helpers/file-array-to-uint8-array.ts";
import { blobUrlToFile } from "@repo/lib/helpers/blobUrlToFile";
import { forumAdminClient } from "@repo/shared/api/forum-client";
import { createNewsSchema } from "@repo/types/schemas/admin/create-news-schema";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea";
import { Button } from "@repo/ui/src/components/button";
import { DeleteButton } from "@repo/ui/src/components/detele-button";
import { Input } from "@repo/ui/src/components/input";
import { Typography } from "@repo/ui/src/components/typography";
import { encode } from "@tanstack/react-router";
import ky from "ky"
import { toast } from "sonner";
import { z } from "zod/v4";
import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/npm-react";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { withReset } from "@reatom/framework";

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
  const res = await forumAdminClient.admin["delete-news"][":id"].$delete({ param: { id } })
  const data = await res.json() as { status: 'success' } | { error: string };

  if ("error" in data) return null

  return data;
}

export type CreateNewsQuery = Omit<z.infer<typeof createNewsSchema>, 'image'> & {
  imageUrl?: string
}

export const createNewsAtom = atom<CreateNewsQuery | null>(null, "createNews").pipe(withReset())

export const createNewsAction = reatomAsync(async (ctx) => {
  const formState = ctx.get(createNewsAtom)
  if (!formState) return;

  let image: File | null = null

  if (formState.imageUrl) {
    image = await blobUrlToFile(formState.imageUrl)
  }

  return await createNews({ image, ...formState })
}, {
  name: "createNewsAction",
  onFulfill: (ctx, res) => {
    if (!res) return

    if (res.data) {
      createNewsAtom.reset(ctx)

      return toast.success('Новость успешно создана')
    }

    return toast.error("Произошла ошибка при создании новости")
  }
}).pipe(withStatusesAtom())

const deleteNewsActionVariablesAtom = atom<string | null>(null, "deleteNewsActionVariables")

export const deleteNewsAction = reatomAsync(async (ctx, id: string) => {
  deleteNewsActionVariablesAtom(ctx, id)
  return await ctx.schedule(() => deleteNews(id))
}, {
  name: "deleteNewsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const variables = ctx.get(deleteNewsActionVariablesAtom)
    if (!variables) return;

    // todo: replace to newsAtom
    // qc.setQueryData(NEWS_QUERY_KEY, (prev: { data: { id: string }[], meta: any }) => ({
    //   ...prev,
    //   data: prev?.data.filter(n => n.id !== variables),
    // }))

    return toast.success('Новость успешно удалена')
  }
}).pipe(withStatusesAtom())

export const CreateNews = reatomComponent(({ ctx }) => {
  const data = ctx.spy(createNewsAtom)

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    type: "title" | "description"
  ) => {
    // @ts-ignore
    createNewsAtom(ctx, (state) => ({ ...state, [type]: e.target.value }))
  }

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;
    if (!e.target.files) return;

    const image = e.target.files[0];
// @ts-ignore
    createNewsAtom(ctx, (state) => ({ ...state, imageUrl: URL.createObjectURL(image) }))
  }

  const deleteImage = () => {
    // @ts-ignore
    createNewsAtom(ctx, (state) => ({ ...state, imageUrl: undefined }))
  }

  const onSubmit = () => createNewsAction(ctx)

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
          disabled={ctx.spy(createNewsAction.statusesAtom).isPending}
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
        pending={ctx.spy(createNewsAction.statusesAtom).isPending}
        disabled={ctx.spy(createNewsAction.statusesAtom).isPending || !data?.title || !data?.description}
        className="w-full lg:w-fit mt-2 px-12"
      >
        <Typography className="font-semibold text-[18px]">
          Создать
        </Typography>
      </Button>
    </div>
  )
}, "CreateNews")