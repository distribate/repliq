import { useCreateEditor } from '@repo/plate-editor/src/hooks/use-create-editor';
import { Editor, EditorContainer } from '@repo/plate-editor/src/ui/editor.tsx';
import { Plate } from '@udecode/plate/react';
import { FixedToolbar } from '@repo/plate-editor/src/ui/fixed-toolbar';
import { FixedToolbarButtons } from '@repo/plate-editor/src/ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '@repo/plate-editor/src/ui/floating-toolbar';
import { FloatingToolbarButtons } from '@repo/plate-editor/src/ui/floating-toolbar-buttons';
import { useEditThread } from '../hooks/use-edit-thread';
import { threadFormQuery } from '../queries/thread-form-query';
import type { Value } from "@udecode/plate"

export const FormThreadEditor = () => {
  const { content } = threadFormQuery().data
  const { updateThreadFormMutation } = useEditThread()
  const editor = useCreateEditor({ value: content });

  const onChange = (value: Value) => {
    updateThreadFormMutation.mutate({ content: value })
  }

  return (
    <Plate editor={editor} onChange={({ value }) => onChange(value)}>
      <EditorContainer className="bg-shark-900 gap-2">
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
        <Editor variant="default" placeholder='Напишите что-нибудь' />
      </EditorContainer>
    </Plate>
  )
}