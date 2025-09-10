import {
  threadContentAtom,
  threadContentfallback
} from '#components/thread/models/thread.model';
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { Plate, usePlateEditor } from 'platejs/react';
import { EditorKit } from '@repo/plate-editor/src/components/editor/editor-kit';
import { Editor, EditorContainer } from '@repo/plate-editor/src/components/ui/editor';

export const ThreadContent = reatomComponent(({ ctx }) => {
  const value = ctx.spy(threadContentAtom) ?? threadContentfallback
  const editor = usePlateEditor({
    plugins: EditorKit,
    value,
  });
  
  useUpdate(() => editor.tf.setValue(value), [value])
  
  return (
    <div className="flex w-full overflow-hidden max-w-full h-full">
      <Plate editor={editor} readOnly={true}>
        <EditorContainer className="*:p-0 gap-2">
          <Editor variant="none" />
        </EditorContainer>
      </Plate>
    </div>
  );
}, "ThreadContent")