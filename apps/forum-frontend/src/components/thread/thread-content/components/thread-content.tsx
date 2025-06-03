import {
  threadContentAtom,
  threadContentfallback
} from '#components/thread/thread-main/models/thread.model.ts';
import { Editor, EditorContainer } from "@repo/plate-editor/src/ui/editor.tsx";
import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@repo/plate-editor/src/hooks/use-create-editor.ts";
import { reatomComponent } from "@reatom/npm-react";

export const ThreadContent = reatomComponent(({ ctx }) => {
  const threadContent = ctx.spy(threadContentAtom) ?? threadContentfallback
  const editor = useCreateEditor({ value: threadContent });

  return (
    <div className="flex w-full overflow-hidden text-wrap max-w-full h-full">
      <Plate editor={editor} readOnly={true}>
        <EditorContainer className="bg-shark-900 gap-2">
          <Editor variant="default" placeholder='Напишите что-нибудь' />
        </EditorContainer>
      </Plate>
    </div>
  );
}, "ThreadContent")