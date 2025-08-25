import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  editPostsControlAtom,
  getPostsControlAtom,
} from "#components/post/post-item/models/post-control.model";
import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useState, ChangeEvent } from "react";
import { controlPostAction } from "#components/post/post-item/models/control-post.model";
import { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { reatomComponent } from "@reatom/npm-react";

type PostItemBodyProps = Pick<UserPostItem, "content" | "id" | "nickname">

const PostItemBodyEditable = reatomComponent<PostItemBodyProps>(({
  ctx, content, id, nickname
}) => {
  const [value, setValue] = useState<string>(content);

  const handleUpdateContent = () => {
    if (!isValid) return;

    editPostsControlAtom(ctx, id, { isEdit: false })

    return controlPostAction(ctx, { type: "edit", id, nickname });
  };

  const handleCancelEdit = () => {
    editPostsControlAtom(ctx, id, { isEdit: false })
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setValue(value);

    editPostsControlAtom(ctx, id, { content: value.length >= 1 ? value : null })
  };

  const isValid = value !== content && !ctx.spy(controlPostAction.statusesAtom).isPending;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input
        maxLength={500}
        placeholder="Расскажи о чём нибудь"
        className="!p-2 !text-[16px] bg-shark-700/10"
        value={value}
        onChange={onChange}
      />
      <div className="flex items-center gap-2 self-end">
        <Button
          disabled={!isValid}
          state="default"
          onClick={handleUpdateContent}
          className="w-fit px-4"
        >
          <Typography>Сохранить</Typography>
        </Button>
        <Button
          onClick={handleCancelEdit}
          variant="negative"
          className="w-fit px-4"
        >
          <Typography>Отмена</Typography>
        </Button>
      </div>
    </div>
  )
}, "PostItemBodyEditable")

type ProcessText = {
  input: string,
  truncate?: boolean
}

const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

const LINK_REGEX = /^https?:\/\/\S+$/

const MAX_LENGHT_NON_EXPANDED = 256

const processText = ({ input, truncate }: ProcessText) => {
  const parts = input.split(/(\s+)/);

  if (truncate && (input.length > MAX_LENGHT_NON_EXPANDED)) {
    return input.slice(0, MAX_LENGHT_NON_EXPANDED) + "...";
  }

  return parts.map((part, index) => {
    if (part.startsWith("#")) {
      return <span key={index} className="text-biloba-flower-300 font-semibold cursor-pointer">
        {part}
      </span>;
    }

    if (part.match(LINK_REGEX)) {
      return (
        <a key={index} href={part} rel="noreferrer" className="text-contessa-300 italic cursor-pointer" target="_blank">
          {part}
        </a>
      );
    }

    if (part.match(EMOJI_REGEX)) {
      return <span key={index} className="cursor-pointer font-semibold">
        {part}
      </span>;
    }

    return part;
  });
};

export const PostItemBody = reatomComponent<PostItemBodyProps>(({
  ctx, content, id, nickname
}) => {
  const [expanded, setExpanded] = useState<boolean>(content.length >= MAX_LENGHT_NON_EXPANDED);
  const postControlState = getPostsControlAtom(ctx, id)

  const isEdit = postControlState.isEdit;

  return (
    <div className="flex w-full">
      {isEdit && (
        <PostItemBodyEditable content={content} id={id} nickname={nickname} />
      )}
      {!isEdit && (
        expanded ? (
          <div className="flex flex-col gap-4 w-full h-fit">
            <Typography>
              {processText({ input: content, truncate: true })}
            </Typography>
            <span className="text-shark-300 cursor-pointer" onClick={() => setExpanded(false)}>
              раскрыть
            </span>
          </div>
        ) : (
          <Typography>
            {processText({ input: content })}
          </Typography>
        )
      )}
    </div>
  );
}, "PostItemBody")