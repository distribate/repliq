import { CustomEditor } from './editor.tsx';
import { BaseEditor } from 'slate';
import { Button } from '@repo/ui/src/components/button.tsx';
import { ImagePlus } from 'lucide-react';
import { TooltipWrapper } from '../../wrappers/tooltip-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Control, Controller } from 'react-hook-form';
import { zodCreateThreadForm } from '../../forms/create-thread/types/create-thread-form-types.ts';

type EditorPanelProps = {
  editor: BaseEditor
} & Partial<{
  control: Control<zodCreateThreadForm, any>
}>

export const EditorPanel = ({
  editor, control
}: EditorPanelProps) => {
  return (
    <div className="flex bg-white/10 w-fit rounded-md items-center">
      <TooltipWrapper
        trigger={
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange, ref, name } }) => {
              return (
                <div className="flex px-4 py-2 gap-2 items-center group relative">
                  <ImagePlus
                    size={16}
                    className="text-shark-300 group-hover:text-caribbean-green-500"
                  />
                  <input
                    type="file"
                    ref={ref}
                    name={name}
                    accept="image/*"
                    multiple
                    className="absolute right-0 top-0 left-0 bottom-0 opacity-0 w-full"
                    onChange={e => onChange(e.target.files)}
                  />
                </div>
              );
            }}
          />
        }
        content={
          <Typography textSize="small">
            Прикрепить изображения
          </Typography>
        }
      />
      <TooltipWrapper
        properties={{ asChild: true }}
        trigger={
          <Button
            border="without"
            type="button"
            onMouseDown={event => {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
            }}
          >
            B
          </Button>
        }
        content={
          <Typography textSize="small">
            Выделить жирным
          </Typography>
        }
      />
      <TooltipWrapper
        properties={{ asChild: true }}
        trigger={
          <Button
            border="without"
            type="button"
            onMouseDown={event => {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
            }}
          >
            C
          </Button>
        }
        content={
          <Typography textSize="small">
            Выделить в виде кода
          </Typography>
        }
      />
      <TooltipWrapper
        properties={{ asChild: true }}
        trigger={
          <Button
            border="without"
            type="button"
            onMouseDown={event => {
              event.preventDefault();
              CustomEditor.toggleItalicMark(editor);
            }}
          >
            I
          </Button>
        }
        content={
          <Typography textSize="small">
            Выделить курсивом
          </Typography>
        }
      />
      <TooltipWrapper
        properties={{ asChild: true }}
        trigger={
          <Button
            border="without"
            type="button"
            onMouseDown={event => {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
            }}
          >
            U
          </Button>
        }
        content={
          <Typography textSize="small">
            Выделить подчеркнутым
          </Typography>
        }
      />
    </div>
  );
};