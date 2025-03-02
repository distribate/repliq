import { useState } from "react";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { createEditor, Descendant } from "slate";
import { RenderElement } from "#components/editor/components/render-element.tsx";
import { RenderLeaf } from "#components/editor/components/render-leaf.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { THREAD_CONTROL_QUERY_KEY, ThreadControlQuery, threadControlQuery } from "#components/thread/components/thread-control/queries/thread-control-query.ts";
import { useController, useForm } from "react-hook-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { handleOnChangeEditor } from "#components/editor/helpers/handle-on-change.ts";
import { ThreadControlSave } from "#components/thread/components/thread-control/components/thread-control-save.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "#components/thread/components/thread-main/queries/thread-query.ts";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { ThreadContentWrapper } from "./thread-content-wrapper.tsx";
import { serializeNodes } from "@repo/lib/helpers/nodes-serializer.ts";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "Произошла ошибка при загрузке контента!" }],
  },
];

type ThreadContentProps = {
  threadId: string;
}

export const ThreadContent = ({
  threadId,
}: ThreadContentProps) => {
  const qc = useQueryClient();
  const [editor] = useState<ReactEditor>(() => withReact(createEditor()));
  const { data: controlState } = threadControlQuery();
  const { control } = useForm();
  const { nickname } = getUser();
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId));
  
  const { field: { onChange } } = useController({
    name: "content", control, rules: { required: true }
  });

  if (!thread) return null;

  const content = thread.content as Descendant[];

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

  const isOwner = thread.owner.nickname === nickname;
  const isContenteditable = controlState?.state?.isContenteditable;
  const isReadonly = !isContenteditable || !isOwner;
  const isTriggered = isContenteditable ?? false;

  return (
    <ThreadContentWrapper variant={isReadonly ? "readonly" : "default"}>
      {isOwner && (
        <div className="w-full overflow-hidden text-wrap">
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
              readOnly={isReadonly}
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
      {!isOwner && (
        <Slate editor={editor} initialValue={content || initialValue}>
          <Editable
            renderLeaf={props => <RenderLeaf {...props} children={props.children} />}
            renderElement={props => <RenderElement {...props} children={props.children} />}
            className="!outline-none"
            placeholder=" "
            readOnly={true}
          />
        </Slate>
      )}
    </ThreadContentWrapper>
  );
};