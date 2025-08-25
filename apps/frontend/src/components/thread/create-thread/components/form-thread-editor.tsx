import { useCreateEditor } from '@repo/plate-editor/src/hooks/use-create-editor';
import { Editor, EditorContainer } from '@repo/plate-editor/src/ui/editor.tsx';
import { Plate } from '@udecode/plate/react';
import { FixedToolbar } from '@repo/plate-editor/src/ui/fixed-toolbar';
import { FixedToolbarButtons } from '@repo/plate-editor/src/ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '@repo/plate-editor/src/ui/floating-toolbar';
import { FloatingToolbarButtons } from '@repo/plate-editor/src/ui/floating-toolbar-buttons';
import { threadFormContentAtom } from '../models/thread-form.model';
import type { Value } from "@udecode/plate"
import { reatomComponent } from '@reatom/npm-react';
import { action } from '@reatom/core';
import { sleep, withConcurrency } from '@reatom/framework';
import { threadContentAtom } from '#components/thread/models/thread.model';

const onChange = action(async (ctx, value: Value) => {
  await ctx.schedule(() => sleep(200))
  threadFormContentAtom(ctx, value)
}, "contentOnChange").pipe(withConcurrency())

export const FormThreadEditor = reatomComponent(({ ctx }) => {
  const value = ctx.spy(threadContentAtom) ?? []
  const editor = useCreateEditor({ value });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => onChange(ctx, value)}
    >
      <EditorContainer className="bg-shark-900 gap-2 min-h-44 h-full">
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
        <Editor variant="default" placeholder='Напишите что-нибудь' className="min-h-44" />
      </EditorContainer>
    </Plate>
  )
}, "FormThreadEditor")