import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  Editable,
  ReactEditor,
  RenderPlaceholderProps,
  Slate,
} from "slate-react";
import { serializeNodes } from "@repo/lib/helpers/nodes-serializer.ts";
import { useController } from "react-hook-form";
import {
  getContentLimit,
  useCreateThread,
} from "../hooks/use-create-thread.tsx";
import { RenderElement } from "#components/editor/components/render-element.tsx";
import { RenderLeaf } from "#components/editor/components/render-leaf.tsx";
import { threadFormQuery } from "../queries/thread-form-query.ts";
import { handleOnChangeEditor } from "#components/editor/helpers/handle-on-change.ts";
import {
  THREAD_CONTENT_LIMIT_DEFAULT,
} from "@repo/shared/constants/limits.ts";
import { FormChildsProps } from "../types/create-thread-form-types.ts";
import { Descendant } from "slate";
import { handleEventKeyDown } from "#components/editor/helpers/handle-event-keydown.ts";

const initialValue = [
  { type: "paragraph", children: [{ text: "" }] },
];

const FormThreadContentPlaceholder = ({ ...props }: RenderPlaceholderProps) => {
  return (
    <span className="py-2 text-[15px]" {...props.attributes}>
      {props.children}
    </span>
  );
};

export const FormThreadContent = ({ errors, control, editor }: FormChildsProps & { editor: ReactEditor }) => {
  const { updateThreadFormMutation } = useCreateThread();
  const { data: threadFormValues } = threadFormQuery();
  const { field: { onChange } } = useController({ name: "content", control, rules: { required: true } });

  const handleOnChange = (value: Descendant[]) => {
    const isAstChange = handleOnChangeEditor(editor, value);

    if (isAstChange) {
      updateThreadFormMutation.mutate({ content: value });
    }
  };

  const contentLength = threadFormValues && threadFormValues.content ? serializeNodes(threadFormValues.content).length : 0;

  return (
    <>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onValueChange={v => onChange(serializeNodes(v))}
        onChange={handleOnChange}
      >
        <Editable
          renderLeaf={(p) => (
            <RenderLeaf {...p} children={p.children} />
          )}
          renderElement={(p) => (
            <RenderElement {...p} children={p.children} />
          )}
          renderPlaceholder={(p) => (
            <FormThreadContentPlaceholder
              {...p}
              children={p.children}
            />
          )}
          onKeyDown={e => handleEventKeyDown({ event: e, editor })}
          placeholder="Напишите что-нибудь"
          className="form-editor !max-w-6xl !text-[16px]"
          disableDefaultStyles={true}
        />
      </Slate>
      <Typography textSize="small" textColor="gray" className="self-end">
        {contentLength}/
        {threadFormValues.images
          ? getContentLimit(threadFormValues.images)
          : THREAD_CONTENT_LIMIT_DEFAULT[2]}
      </Typography>
      {errors.content && (
        <span className="text-red-600 text-[16px] font-normal">
          {errors.content.message}
        </span>
      )}
    </>
  );
};
