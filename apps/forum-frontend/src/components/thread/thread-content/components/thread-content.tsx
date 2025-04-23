import { Typography } from "@repo/ui/src/components/typography.tsx";
import { THREAD_CONTROL_QUERY_KEY, threadControlQuery } from "#components/thread/thread-control/queries/thread-control-query.ts";
import { useController, useForm } from "react-hook-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadControlSave } from "#components/thread/thread-control/components/thread-control-save.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "#components/thread/thread-main/queries/thread-query.ts";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { ThreadContentWrapper } from "./thread-content-wrapper.tsx";
import { Editor, EditorContainer } from "@repo/plate-editor/src/ui/editor.tsx";
import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@repo/plate-editor/src/hooks/use-create-editor.ts";

const fallback = [
  {
    type: "paragraph",
    children: [{ text: "Произошла ошибка при загрузке контента!" }],
  },
];

type ThreadContentProps = {
  threadId: string;
}

// ##
// Todo: implement edit mode for thread's owner
// ##

export const ThreadContent = ({
  threadId,
}: ThreadContentProps) => {
  const qc = useQueryClient();
  const { data: controlState } = threadControlQuery();
  const { control } = useForm();
  const { nickname } = getUser();
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId));

  const editor = useCreateEditor({ value: thread?.content ?? fallback });

  const { field: { onChange } } = useController({
    name: "content", control, rules: { required: true }
  });

  if (!thread) return null;

  // const handleOnChange = (value: Descendant[]) => {
  //   const isAstChange = handleOnChangeEditor(editor, value);

  //   if (isAstChange) {
  //     return qc.setQueryData(
  //       THREAD_CONTROL_QUERY_KEY,
  //       (prev: ThreadControlQuery) => ({
  //         state: {
  //           ...prev.state,
  //           isValid: controlState.values ? controlState.values.content !== thread.content : false,
  //         },
  //         values: { ...prev.values, content: value },
  //       }),
  //     )
  //   }
  // };

  const handleCancelEdit = () => {
    editor.children = thread.content;

    return qc.resetQueries({
      queryKey: THREAD_CONTROL_QUERY_KEY
    });
  };

  const isOwner = thread.owner.nickname === nickname;
  const isContenteditable = controlState?.state?.isContenteditable;
  const isReadonly = !isContenteditable || !isOwner;
  const isTriggered = isContenteditable ?? false;

  return (
    <>
      <ThreadContentWrapper variant={isReadonly ? "readonly" : "default"}>
        {isOwner && (
          <div className="w-full overflow-hidden text-wrap">
            <Plate
              editor={editor}
              readOnly
            >
              <EditorContainer className="bg-shark-900 gap-2">
                <Editor variant="default" placeholder='Напишите что-нибудь' />
              </EditorContainer>
            </Plate>
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
        {/* {!isOwner && (
          <Slate editor={editor} initialValue={content || initialValue}>
            <Editable
              renderLeaf={props => <RenderLeaf {...props} children={props.children} />}
              renderElement={props => <RenderElement {...props} children={props.children} />}
              className="!outline-none"
              placeholder=" "
              readOnly={true}
            />
          </Slate>
        )} */}
      </ThreadContentWrapper>
    </>
  );
};