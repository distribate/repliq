import { Typography } from "@repo/ui/src/components/typography.tsx";
import { threadFormTagsAtom } from "../models/thread-form.model.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { X } from "lucide-react";
import { THREAD_TAGS_LIMIT } from "@repo/shared/constants/limits.ts";
import { reatomComponent } from "@reatom/npm-react";
import { action, atom } from "@reatom/core";
import { sleep, withConcurrency } from "@reatom/framework";

const tagValueAtom = atom<string>("", "tagValue")

const onChange = action(async (ctx, e) => {
  const { value } = e.target
  await ctx.schedule(() => sleep(200))
  tagValueAtom(ctx, value)
}).pipe(withConcurrency())

const deleteTagAction = action((ctx, idx: number) => {
  const tags = ctx.get(threadFormTagsAtom)
  if (!tags) return;

  const updatedTags = tags.filter((_, i) => i !== idx);

  threadFormTagsAtom(ctx, updatedTags.length >= 1 ? updatedTags : null)
})

const addTagAction = action((ctx) => {
  const tags = ctx.get(threadFormTagsAtom)

  if (tags && tags.length >= THREAD_TAGS_LIMIT[1]) return;

  const value = ctx.get(tagValueAtom)

  threadFormTagsAtom(ctx, (state) => {
    if (!state) state = []
    return [...state, value]
  })
})

const SelectedTagsList = reatomComponent(({ ctx }) => {
  const tags = ctx.spy(threadFormTagsAtom)
  if (!tags) return;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-shark-500 rounded-sm px-2 py-3 h-3 overflow-hidden"
        >
          <Typography className="text-[15px] font-medium">
            {tag.toString()}
          </Typography>
          <X
            onClick={() => deleteTagAction(ctx, i)}
            size={15}
            className="text-shark-50 cursor-pointer"
          />
        </div>
      ))}
    </div>
  )
})

const SelectedTags = reatomComponent(({ ctx }) => {
  const tags = ctx.spy(threadFormTagsAtom)

  return (
    <div className="flex flex-col gap-2 min-h-[100px] max-h-[200px] rounded-md p-2 bg-shark-900">
      <SelectedTagsList />
      {!tags || (tags && tags.length < THREAD_TAGS_LIMIT[1]) ? (
        <Input
          placeholder={!tags ? "тег" : ""}
          className="!p-0 !m-0 !min-h-3 w-fit !text-[15px]"
          onChange={e => onChange(ctx, e)}
        />
      ) : (
        <Typography className="text-red-500 text-[15px]">
          Максимальное количество тегов
        </Typography>
      )}
    </div>
  )
})

export const FormThreadAdditional = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-y-2 w-full rounded-md px-4 py-2 bg-primary-color">
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="large">
            Теги
          </Typography>
          <Typography className="text-shark-300" textSize="medium">
            теги для поиска треда, перечисление через запятую
          </Typography>
        </div>
        <SelectedTags />
        <div onClick={() => addTagAction(ctx)}>
          <Typography>
            Добавить
          </Typography>
        </div>
      </div>
    </div>
  );
}, "FormThreadAdditional")