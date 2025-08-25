import {
  threadContentAtom,
  threadContentfallback
} from '#components/thread/models/thread.model';
import { Editor, EditorContainer } from "@repo/plate-editor/src/ui/editor.tsx";
import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@repo/plate-editor/src/hooks/use-create-editor.ts";
import { reatomComponent, useUpdate } from "@reatom/npm-react";

export const ThreadContent = reatomComponent(({ ctx }) => {
  const value = ctx.spy(threadContentAtom) ?? threadContentfallback
  const editor = useCreateEditor({ value })
  
  useUpdate(() => editor.tf.setValue(value), [value])
  
  return (
    <div className="flex w-full overflow-hidden max-w-full h-full">
      <Plate editor={editor} readOnly={true}>
        <EditorContainer className="*:p-0 gap-2">
          <Editor variant="default" />
        </EditorContainer>
      </Plate>
    </div>
  );
}, "ThreadContent")