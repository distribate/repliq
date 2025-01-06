"use client";

import { useState } from "react";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { createEditor, Descendant } from "slate";
import { RenderElement } from "#editor/components/render-element.tsx";
import { RenderLeaf } from "#editor/components/render-leaf.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  THREAD_CONTROL_QUERY_KEY,
  ThreadControlQuery,
  threadControlQuery,
} from "#thread/components/thread-control/queries/thread-control-query.ts";
import { serializeNodes } from "../../../../../../lib/helpers/nodes-serializer.ts";
import { useController, useForm } from "react-hook-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { handleOnChangeEditor } from "#editor/helpers/handle-on-change.ts";
import { ThreadControlSave } from "#thread/components/thread-control/components/thread-control-save.tsx";
import { useQueryClient } from "@tanstack/react-query";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "Произошла ошибка при загрузке контента!" }],
  },
];

type ThreadContentProps = {
  content: Descendant[];
  isThreadOwner: boolean;
  threadId: string;
}

export const ThreadContent = ({
  content, isThreadOwner, threadId,
}: ThreadContentProps) => {
  const qc = useQueryClient();
  const { data: controlState } = threadControlQuery();
  const [editor] = useState<ReactEditor>(() => withReact(createEditor()));
  const { control } = useForm();

  const { field: { onChange } } = useController({ name: "content", control, rules: { required: true } });

  const handleOnChange = (value: Descendant[]) => {
    const isAstChange = handleOnChangeEditor(editor, value);

    if (isAstChange) {
      return qc.setQueryData(
        THREAD_CONTROL_QUERY_KEY,
        (prev: ThreadControlQuery) => ({
          state: {
            ...prev.state,
            isValid: controlState.values ? controlState.values.content !== content : false,
          },
          values: { ...prev.values, content: value },
        }),
      )
    }
  };

  const handleCancelEdit = () => {
    editor.children = content;

    return qc.resetQueries({
      queryKey: THREAD_CONTROL_QUERY_KEY
    });
  };

  const isContenteditable = controlState?.state?.isContenteditable;
  const isReadOnly = !isContenteditable || !isThreadOwner;
  const isTriggered = isContenteditable ?? false;

  console.log("isThreadOwner", isThreadOwner)
  console.log("isReadOnly", isReadOnly)
  console.log("isContenteditable", isContenteditable)

  return (
    <div
      className={`${isReadOnly ? "" : "!bg-shark-800"} px-4 w-full h-full flex !rounded-none`}
    >
      {isThreadOwner && (
        <div className="w-full">
          <Slate
            editor={editor}
            initialValue={content || initialValue}
            onValueChange={(value) => onChange(serializeNodes(value))}
            onChange={handleOnChange}
          >
            <Editable
              renderLeaf={(props) => (
                <RenderLeaf {...props} children={props.children} />
              )}
              renderElement={(props) => (
                <RenderElement {...props} children={props.children} />
              )}
              readOnly={isReadOnly}
              className="!outline-none"
              placeholder=" "
            />
          </Slate>
          {isTriggered && (
            <div className="flex my-4 items-center gap-2 w-full justify-end">
              <ThreadControlSave threadId={threadId} />
              <Button variant="negative" onClick={handleCancelEdit}>
                <Typography>Отменить</Typography>
              </Button>
            </div>
          )}
        </div>
      )}
      {!isThreadOwner && (
        <Slate editor={editor} initialValue={content || initialValue}>
          <Editable
            renderLeaf={(props) => (
              <RenderLeaf {...props} children={props.children} />
            )}
            renderElement={(props) => (
              <RenderElement {...props} children={props.children} />
            )}
            className="!outline-none"
            placeholder=" "
            readOnly={true}
          />
        </Slate>
      )}
    </div>
  );
};
