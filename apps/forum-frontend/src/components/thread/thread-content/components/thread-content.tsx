import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useController, useForm } from "react-hook-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadControlSave } from "#components/thread/thread-control/components/thread-control-save.tsx";
import { threadAtom } from "#components/thread/thread-main/models/thread.model.ts";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user.ts";
import { ThreadContentWrapper } from "./thread-content-wrapper.tsx";
import { Editor, EditorContainer } from "@repo/plate-editor/src/ui/editor.tsx";
import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@repo/plate-editor/src/hooks/use-create-editor.ts";
import { reatomComponent } from "@reatom/npm-react";
import { threadControlAtom } from "#components/thread/thread-control/models/thread-control.model.ts";

const fallback = [
  { type: "paragraph", children: [{ text: "Произошла ошибка при загрузке контента!" }] },
];

export const ThreadContent = reatomComponent(({ ctx }) => {
  const controlState = ctx.spy(threadControlAtom)
  const nickname = ctx.spy(currentUserNicknameAtom)
  const thread = ctx.spy(threadAtom)
  const control = useForm().control;
  const editor = useCreateEditor({ value: thread?.content ?? fallback });

  const { field: { onChange } } = useController({
    name: "content", control, rules: { required: true }
  });

  if (!thread) return null;

  const isOwner = thread.owner.nickname === nickname;
  const isContenteditable = controlState?.state?.isContenteditable;
  const isReadonly = !isContenteditable || !isOwner;
  const isTriggered = isContenteditable ?? false;

  const handleCancelEdit = () => {
    editor.children = thread.content;

    threadControlAtom.reset(ctx)
  };

  return (
    <>
      <ThreadContentWrapper variant={isReadonly ? "readonly" : "default"}>
        <div className="w-full overflow-hidden text-wrap">
          <Plate editor={editor} readOnly={isReadonly}>
            <EditorContainer className="bg-shark-900 gap-2">
              <Editor variant="default" placeholder='Напишите что-нибудь' />
            </EditorContainer>
          </Plate>
          {isTriggered && (
            <div className="flex my-4 items-center gap-2 w-full justify-end">
              <ThreadControlSave threadId={thread.id} />
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