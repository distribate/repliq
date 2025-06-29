import { Typography } from "@repo/ui/src/components/typography.tsx";
import { addTagAction, deleteTagAction, tagValueAtom, threadFormTagsAtom } from "../models/thread-form.model.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { THREAD_TAGS_LIMIT } from "@repo/shared/constants/limits.ts";
import { reatomComponent } from "@reatom/npm-react";
import { useEffect } from "react";
import { IconX } from "@tabler/icons-react";

const SelectedTagsList = reatomComponent(({ ctx }) => {
  const tags = ctx.spy(threadFormTagsAtom)
  if (!tags) return;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag, i) => (
        <div
          key={i}
          className="flex items-center gap-2 justify-between bg-shark-300/20 backdrop-blur-xl rounded-sm px-2 py-3 h-3 overflow-hidden"
        >
          <Typography className="text-[15px] font-medium">
            {tag}
          </Typography>
          <IconX
            onClick={() => deleteTagAction(ctx, i)}
            size={18}
            className="text-shark-300 cursor-pointer"
          />
        </div>
      ))}
    </div>
  )
}, "SelectedTagsList")

const SelectedTags = reatomComponent(({ ctx }) => {
  const tags = ctx.spy(threadFormTagsAtom)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") addTagAction(ctx)
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 min-h-[100px] rounded-md p-2 bg-shark-900">
      <SelectedTagsList />
      {!tags || (tags && tags.length < THREAD_TAGS_LIMIT[1]) ? (
        <Input
          placeholder={!tags ? "тег" : ""}
          className="!p-0 !m-0 !min-h-3 w-fit !text-[15px]"
          value={ctx.spy(tagValueAtom)}
          onChange={e => tagValueAtom(ctx, e.target.value)}
          maxLength={512}
        />
      ) : (
        <Typography className="text-red-500 text-[15px]">
          Максимальное количество тегов
        </Typography>
      )}
    </div>
  )
}, "SelectedTags")

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
      </div>
    </div>
  );
}, "FormThreadAdditional")