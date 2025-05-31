import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadControlSave } from "#components/thread/thread-control/components/thread-control-save.tsx";
import {
  threadContentAtom,
  threadContentfallback,
  threadModeAtom,
  threadOwnerAtom,
  threadParamAtom,
} from '#components/thread/thread-main/models/thread.model.ts';
import { Editor, EditorContainer } from "@repo/plate-editor/src/ui/editor.tsx";
import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@repo/plate-editor/src/hooks/use-create-editor.ts";
import { reatomComponent } from "@reatom/npm-react";
import { threadControlAtom } from "#components/thread/thread-control/models/thread-control.model.ts";
import { HTMLAttributes } from "react"

type ThreadContentWrapperProps = HTMLAttributes<HTMLDivElement>

const ThreadContentWrapper = reatomComponent<ThreadContentWrapperProps>(({
  ctx, className, ...props
}) => {
  return (
    <div
      data-variant={ctx.spy(threadModeAtom)}
      className="flex px-4 max-w-full h-full rounded-none data-[state=edit]:bg-shark-800"
      {...props}
    />
  )
}, "ThreadContentWrapper")

export const ThreadContent = reatomComponent(({ ctx }) => {
  const threadOwner = ctx.spy(threadOwnerAtom)
  const threadId = ctx.spy(threadParamAtom)
  const threadContent = ctx.spy(threadContentAtom) ?? threadContentfallback
  const threadMode = ctx.spy(threadModeAtom)
  const editor = useCreateEditor({ value: threadContent });

  if (!threadOwner || !threadId) return null;

  const handleCancelEdit = () => {
    editor.children = threadContent;
    threadControlAtom.reset(ctx)
  };

  return (
    <>
      <ThreadContentWrapper>
        <div className="w-full overflow-hidden text-wrap">
          <Plate editor={editor} readOnly={threadMode === 'read'}>
            <EditorContainer className="bg-shark-900 gap-2">
              <Editor variant="default" placeholder='Напишите что-нибудь' />
            </EditorContainer>
          </Plate>
          {threadMode === 'edit' && (
            <div className="flex my-4 items-center gap-2 w-full justify-end">
              <ThreadControlSave threadId={threadId} />
              <Button variant="negative" onClick={handleCancelEdit}>
                <Typography>Отменить</Typography>
              </Button>
            </div>
          )}
        </div>
      </ThreadContentWrapper>
    </>
  );
}, "ThreadContent")