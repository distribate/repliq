import { Typography } from "@repo/ui/src/components/typography.tsx";
import { addTagAction, deleteTagAction, tagValueAtom, threadFormTagsAtom } from "../models/thread-form.model.ts";
import { THREAD_TAGS_LIMIT } from "@repo/shared/constants/limits.ts";
import { reatomComponent } from "@reatom/npm-react";
import { useEffect } from "react";
import { IconX } from "@tabler/icons-react";
import { Textarea } from "@repo/ui/src/components/textarea.tsx";
import { atom } from "@reatom/core";

const SelectedTag = reatomComponent<{ content: string, idx: number }>(({ ctx, content, idx }) => {
  return (
    <div
      className="flex items-center gap-2 justify-between bg-shark-300/40 rounded-md px-2 py-3 h-3 overflow-hidden"
    >
      <Typography className="text-lg text-shark-50">
        {content}
      </Typography>
      <IconX
        size={18}
        className="text-shark-300 cursor-pointer"
        onClick={() => deleteTagAction(ctx, idx)}
      />
    </div>
  )
}, "SelectedTag")

const SelectedTagsList = reatomComponent(({ ctx }) => {
  const tags = ctx.spy(threadFormTagsAtom)
  if (!tags) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 w-full">
      {tags.map((tag, idx) => <SelectedTag key={idx} content={tag} idx={idx} />)}
    </div>
  )
}, "SelectedTagsList")

const tagsIsValidAtom = atom((ctx) => {
  const tags = ctx.spy(threadFormTagsAtom)
  if (!tags) return true;

  return tags.length >= 1 && tags.length < THREAD_TAGS_LIMIT[1]
}, "tagsIsValidAtom")

const SelectedTagsTextarea = reatomComponent(({ ctx }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addTagAction(ctx)
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isValid = ctx.spy(tagsIsValidAtom)

  if (!isValid) {
    return (
      <Typography className="text-red-500 text-[15px]">
        Максимальное количество тегов
      </Typography>
    )
  }

  return (
    <Textarea
      className="flex w-full h-full text-lg !p-0 !m-0 min-h-28 "
      value={ctx.spy(tagValueAtom)}
      placeholder="Введите ключевое слово"
      onChange={e => tagValueAtom(ctx, e.target.value)}
      maxLength={512}
    />
  )
}, "SelectedTagsTextarea")

export const FormThreadAdditional = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full rounded-md px-4 py-2 bg-primary-color">
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">
          Теги
        </Typography>
        <Typography className="text-shark-300" textSize="medium">
          теги для поиска треда, перечисление через запятую
        </Typography>
      </div>
      <div className="flex flex-col items-start gap-2 p-2 min-h-28 overflow-hidden rounded-lg bg-shark-900">
        <SelectedTagsList />
        <SelectedTagsTextarea />
      </div>
    </div>
  );
}