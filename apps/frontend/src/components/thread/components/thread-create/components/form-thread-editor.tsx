import { threadFormContentAtom } from '../models/thread-form.model';
import type { Value } from "@udecode/plate"
import { reatomComponent } from '@reatom/npm-react';
import { action } from '@reatom/core';
import { sleep, withConcurrency } from '@reatom/framework';

import { Plate, usePlateEditor } from 'platejs/react';
import { EditorKit } from '@repo/plate-editor/src/components/editor/editor-kit';
import { Editor, EditorContainer } from '@repo/plate-editor/src/components/ui/editor';
import { FixedToolbarKit } from '@repo/plate-editor/src/components/editor/plugins/fixed-toolbar-kit';
import { FloatingToolbarKit } from '@repo/plate-editor/src/components/editor/plugins/floating-toolbar-kit';

const onChange = action(async (ctx, value: Value) => {
  await ctx.schedule(() => sleep(200))
  threadFormContentAtom(ctx, value)
}, "contentOnChange").pipe(withConcurrency())

export const FormThreadEditor = reatomComponent(({ ctx }) => {
  const value = ctx.spy(threadFormContentAtom) ?? []

  const editor = usePlateEditor({
    plugins: [
      ...EditorKit,
      ...FixedToolbarKit,
      ...FloatingToolbarKit,
    ],
    value,
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => onChange(ctx, value)}
    >
      <EditorContainer className="bg-shark-900 gap-2 min-h-44 h-full">
        <Editor
          variant="none"
          placeholder='Напишите что-нибудь'
          className="min-h-44 p-2"
        />
      </EditorContainer>
    </Plate>
  )
}, "FormThreadEditor")