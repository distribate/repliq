import { CustomEditor } from './editor.tsx';
import { BaseEditor } from 'slate';
import { Button } from '@repo/ui/src/components/button.tsx';
import { TooltipWrapper } from '../../wrappers/tooltip-wrapper.tsx';
import { ReactNode } from 'react';

type EditorPanelProps = {
  editor: BaseEditor
} & Partial<{
  withImage: {
    trigger: ReactNode,
    content: ReactNode
  }
}>

const WithImage = ({
  withImage,
}: Omit<EditorPanelProps, 'editor'>) => {
  if (!withImage) return;
  return (
    <TooltipWrapper
      trigger={withImage.trigger}
      content={withImage.content}
    />
  );
};

export const EditorPanel = ({
  editor, withImage,
}: EditorPanelProps) => {
  return (
    <div className="flex bg-shark-700 w-fit rounded-md items-center">
      <WithImage withImage={withImage} />
      <Button
        title="Выделить жирным"
        type="button"
        onMouseDown={event => {
          event.preventDefault();
          CustomEditor.toggleBoldMark(editor);
        }}
      >
        B
      </Button>
      <Button
        title="Выделить в виде кода"
        type="button"
        onMouseDown={event => {
          event.preventDefault();
          CustomEditor.toggleCodeBlock(editor);
        }}
      >
        C
      </Button>
      <Button
        title="Выделить курсивом"
        type="button"
        onMouseDown={event => {
          event.preventDefault();
          CustomEditor.toggleItalicMark(editor);
        }}
      >
        I
      </Button>
      <Button
        title="Выделить подчеркнутым"
        type="button"
        onMouseDown={event => {
          event.preventDefault();
          CustomEditor.toggleCodeBlock(editor);
        }}
      >
        U
      </Button>
    </div>
  );
};