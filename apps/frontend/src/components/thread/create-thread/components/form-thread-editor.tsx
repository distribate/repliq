import { threadFormContentAtom } from '../models/thread-form.model';
import type { Value } from "@udecode/plate"
import { reatomComponent } from '@reatom/npm-react';
import { action } from '@reatom/core';
import { sleep, withConcurrency } from '@reatom/framework';
import { threadContentAtom } from '#components/thread/models/thread.model';
import { Plate, usePlateEditor } from 'platejs/react';
import { EditorKit } from '@repo/plate-editor/src/components/editor/editor-kit';
import { Editor, EditorContainer } from '@repo/plate-editor/src/components/ui/editor';

const onChange = action(async (ctx, value: Value) => {
  await ctx.schedule(() => sleep(200))
  threadFormContentAtom(ctx, value)
}, "contentOnChange").pipe(withConcurrency())

export const FormThreadEditor = reatomComponent(({ ctx }) => {
  const value = ctx.spy(threadContentAtom) ?? []
  const editor = usePlateEditor({
    plugins: EditorKit,
    value,
  });
  
  return (
    <Plate
      editor={editor}
      onChange={({ value }) => onChange(ctx, value)}
    >
      <EditorContainer className="bg-shark-900 gap-2 min-h-44 h-full">
        <Editor variant="default" placeholder='Напишите что-нибудь' className="min-h-44" />
      </EditorContainer>
    </Plate>
  )
}, "FormThreadEditor")